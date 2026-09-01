# Instant Mechanic Dashboard — Backend

REST + real-time API powering the Instant Mechanic Live Vehicle Service
Operations Dashboard.

## Project Overview

Operations teams need a live view of bookings, mechanics, customers and
revenue. This service exposes that data over a REST API and pushes status
changes to connected dashboards in real time over Socket.IO, so a booking
moving from `PENDING → ASSIGNED → ON_THE_WAY → COMPLETED` shows up on screen
without a page refresh.

## Tech Stack

| Layer          | Choice                             |
|----------------|-------------------------------------|
| Runtime        | Node.js + TypeScript                |
| Framework      | Express                             |
| Database       | MongoDB Atlas + Mongoose            |
| Real-time      | Socket.IO                           |
| Validation     | Zod                                 |
| API docs       | swagger-ui-express (OpenAPI 3, `docs/swagger.yaml`) |
| Seed data      | @faker-js/faker                     |
| Deployment     | AWS EC2 (backend), Vercel (frontend, separate repo) |

## Architecture

```
Frontend (Next.js, Vercel)
        │  REST + Socket.IO
        ▼
API (Express, this repo)
        │
   Route → Controller → Service → Mongoose Model
        │
        ▼
MongoDB Atlas
```

- **`app.ts`** — Express app: middleware, routes, Swagger, error handling.
- **`server.ts`** — boots the HTTP server, connects Mongo, initializes
  Socket.IO, starts the optional live-simulation job, handles graceful
  shutdown.
- **Routes → Controllers → Services → Models** — a request is validated and
  parsed in the controller, all business logic and DB queries live in the
  service, models are plain Mongoose schemas.
- **`sockets/`** — Socket.IO setup and the event emitters services call into
  (`booking:created`, `booking:updated`, `dashboard:statsChanged`).
- **`seed/seed.ts`** — generates 50 customers, 20 mechanics, 8 services and
  520 bookings spread across the last 60 days with realistic status
  distributions.

### Why Vehicle is embedded, not a collection

A booking's vehicle (brand/model/registration) is stored inline on the
`Booking` document rather than as a separate collection. For this scope a
vehicle is only ever referenced by the one booking that mentions it, so a
join would add complexity without a real benefit — this can be pulled out
into its own collection later if vehicles need to be tracked across repeat
visits.

### "Live" dashboard without manual clicking

Set `ENABLE_LIVE_SIMULATION=true` and the server will, every
`SIMULATION_INTERVAL_MS`, pick a few in-flight bookings and advance them one
step through their status lifecycle — assigning a free mechanic where
needed — emitting the exact same `booking:updated` Socket.IO event a real
status-update call would. This is what makes the dashboard visibly "live"
during a demo without anyone driving it by hand. It's a demo aid only; disable
it in production if you don't want automatic status churn.

## API

Full interactive docs are served at **`/api-docs`** once the server is
running (OpenAPI spec: `docs/swagger.yaml`).

| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| GET    | `/api/dashboard/overview`     | Totals: bookings, revenue, mechanics, etc. |
| GET    | `/api/dashboard/analytics`    | Chart data: bookings/revenue over time, breakdowns |
| GET    | `/api/bookings`                | List, with `search`, `status`, `mechanic`, `customer`, `sortBy`, `sortOrder`, `dateFrom`, `dateTo`, `page`, `limit` |
| GET    | `/api/bookings/:id`            | Booking detail |
| POST   | `/api/bookings`                | Create a booking |
| PATCH  | `/api/bookings/:id/status`     | Update status (validates legal transitions, emits socket event) |
| GET    | `/api/mechanics`               | List, with `search`, `status`, `page`, `limit` |
| GET    | `/api/mechanics/:id`           | Mechanic detail + recent bookings |
| GET    | `/api/customers`               | List, with `search`, `page`, `limit` |
| GET    | `/api/customers/:id`           | Customer detail + booking history |

### Socket.IO events

Connect to the same origin the API is deployed on (no separate namespace).

| Event                     | Payload                                                       |
|----------------------------|----------------------------------------------------------------|
| `booking:created`          | The newly created booking (populated)                          |
| `booking:updated`          | `{ bookingId, oldStatus, newStatus, mechanicId, updatedAt }`    |
| `dashboard:statsChanged`   | No payload — signal to refetch `/api/dashboard/overview`        |

## Local Setup

```bash
npm install
cp .env.example .env   # then fill in MONGODB_URI (MongoDB Atlas connection string)
npm run seed            # populates the database with sample data
npm run dev              # starts the API on http://localhost:5000
```

Visit `http://localhost:5000/api-docs` for interactive API docs and
`http://localhost:5000/health` for a health check.

## Environment Variables

| Variable                  | Description                                              | Default |
|-----------------------------|------------------------------------------------------------|---------|
| `PORT`                      | Port the server listens on                                 | `5000`  |
| `NODE_ENV`                  | `development` / `production`                                | `development` |
| `MONGODB_URI`                | MongoDB Atlas connection string                              | — |
| `CORS_ORIGINS`               | Comma-separated list of allowed frontend origins             | `http://localhost:3000` |
| `ENABLE_LIVE_SIMULATION`     | `true` to auto-progress bookings for a live demo             | `false` |
| `SIMULATION_INTERVAL_MS`     | How often the simulation job runs, in ms                     | `8000`  |

## Deployment (AWS EC2)

1. Provision a small EC2 instance (Free Tier: `t2.micro`, Ubuntu).
2. Install Node.js, clone this repo, `npm install`, `npm run build`.
3. Set environment variables (`.env` or instance-level) — most importantly
   `MONGODB_URI` (MongoDB Atlas, so no DB hosting needed on the instance) and
   `CORS_ORIGINS` pointed at the deployed Vercel frontend URL.
4. Run with a process manager, e.g. `pm2 start dist/server.js --name instant-mechanic-api`.
5. Open the security group's inbound rule for the chosen port (or put Nginx
   in front on port 80/443).
6. `npm run seed:prod` once, against the production database, to load sample
   data.

## AI Usage

_Fill this in for submission — see below._

This backend was scaffolded and implemented with Claude, based on an initial
architecture plan drafted with ChatGPT (folder structure, request flow,
socket flow, and collection design). Claude implemented the actual Express
app: models, services, controllers, routes, validation, error handling,
Socket.IO wiring, the live-simulation demo job, the seed script, and the
OpenAPI spec. Before submitting, review each file, and be ready to explain:
why the vehicle is embedded rather than a separate collection, how the
status-transition guard in `booking.service.ts` works, how the Socket.IO
events flow from a status update to the frontend, and why indexes were added
where they were (`Booking` is indexed on `status + createdAt`, `mechanic +
status`, and text search fields — these are the queries the dashboard
actually runs).
