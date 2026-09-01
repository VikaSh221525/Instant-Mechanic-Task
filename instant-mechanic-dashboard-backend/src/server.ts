import http from "http";
import "./models";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { initSocket } from "./sockets";
import { startSimulation, stopSimulation } from "./services/simulation.service";

async function main() {
  await connectDB();

  const app = createApp();
  const httpServer = http.createServer(app);

  initSocket(httpServer);
  startSimulation();

  httpServer.listen(env.port, () => {
    console.log(`[server] listening on port ${env.port} (${env.nodeEnv})`);
    console.log(`[server] API docs: http://localhost:${env.port}/api-docs`);
  });

  const shutdown = (signal: string) => {
    console.log(`[server] received ${signal}, shutting down gracefully...`);
    stopSimulation();
    httpServer.close(() => {
      console.log("[server] closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
