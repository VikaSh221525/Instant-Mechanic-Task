import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { env } from "../config/env";
import { Customer } from "../models/Customer";
import { Mechanic } from "../models/Mechanic";
import { Service } from "../models/Service";
import { Booking } from "../models/Booking";
import { BookingStatus, MechanicStatus } from "../types";

const SERVICE_CATALOG = [
  { name: "Engine Diagnostics", category: "Engine", basePrice: 1200, estimatedDurationMins: 60 },
  { name: "Oil Change", category: "Maintenance", basePrice: 800, estimatedDurationMins: 30 },
  { name: "Brake Repair", category: "Brakes", basePrice: 2200, estimatedDurationMins: 90 },
  { name: "Battery Replacement", category: "Electrical", basePrice: 3500, estimatedDurationMins: 20 },
  { name: "Tyre Replacement", category: "Tyres", basePrice: 4500, estimatedDurationMins: 45 },
  { name: "AC Repair", category: "Climate Control", basePrice: 1800, estimatedDurationMins: 75 },
  { name: "Suspension Check", category: "Suspension", basePrice: 1500, estimatedDurationMins: 60 },
  { name: "Full Body Wash & Detailing", category: "Cosmetic", basePrice: 900, estimatedDurationMins: 40 },
];

const VEHICLE_BRANDS: Record<string, string[]> = {
  Honda: ["City", "Amaze", "WR-V", "Civic"],
  Maruti: ["Swift", "Baleno", "Dzire", "Ertiga"],
  Hyundai: ["i20", "Creta", "Verna", "Venue"],
  Tata: ["Nexon", "Punch", "Altroz", "Harrier"],
  Toyota: ["Innova", "Fortuner", "Glanza"],
  Kia: ["Seltos", "Sonet"],
  Mahindra: ["XUV700", "Scorpio", "Thar"],
};

const SPECIALIZATIONS = [
  "Engine Systems",
  "Electrical Systems",
  "Brakes & Suspension",
  "AC & Climate Control",
  "General Maintenance",
  "Tyres & Wheels",
];

const STATUS_WEIGHTS: [BookingStatus, number][] = [
  [BookingStatus.COMPLETED, 55],
  [BookingStatus.PENDING, 15],
  [BookingStatus.ASSIGNED, 12],
  [BookingStatus.ON_THE_WAY, 8],
  [BookingStatus.CANCELLED, 10],
];

function weightedStatus(): BookingStatus {
  const total = STATUS_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [status, weight] of STATUS_WEIGHTS) {
    if (roll < weight) return status;
    roll -= weight;
  }
  return BookingStatus.COMPLETED;
}

function randomRegistration(): string {
  const states = ["DL", "HR", "UP", "MH", "KA", "TN", "RJ", "GJ"];
  const state = faker.helpers.arrayElement(states);
  const rto = faker.number.int({ min: 1, max: 99 }).toString().padStart(2, "0");
  const letters = faker.string.alpha({ length: 2, casing: "upper" });
  const digits = faker.number.int({ min: 1000, max: 9999 });
  return `${state}${rto}${letters}${digits}`;
}

async function seed() {
  console.log("[seed] connecting to MongoDB...");
  await mongoose.connect(env.mongodbUri);

  console.log("[seed] clearing existing collections...");
  await Promise.all([
    Customer.deleteMany({}),
    Mechanic.deleteMany({}),
    Service.deleteMany({}),
    Booking.deleteMany({}),
  ]);

  console.log("[seed] creating services...");
  const services = await Service.insertMany(SERVICE_CATALOG);

  console.log("[seed] creating 50 customers...");
  const customers = await Customer.insertMany(
    Array.from({ length: 50 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number("98#######0"),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
    }))
  );

  console.log("[seed] creating 20 mechanics...");
  const mechanics = await Mechanic.insertMany(
    Array.from({ length: 20 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number("98#######0"),
      specialization: faker.helpers.arrayElement(SPECIALIZATIONS),
      status: faker.helpers.weightedArrayElement([
        { value: MechanicStatus.AVAILABLE, weight: 6 },
        { value: MechanicStatus.BUSY, weight: 3 },
        { value: MechanicStatus.OFFLINE, weight: 1 },
      ]),
      jobsCompleted: faker.number.int({ min: 5, max: 120 }),
      rating: Number(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })),
    }))
  );

  console.log("[seed] creating 520 bookings...");
  const bookingDocs = [];
  const now = new Date();

  for (let i = 0; i < 520; i++) {
    const status = weightedStatus();
    const service = faker.helpers.arrayElement(services);
    const customer = faker.helpers.arrayElement(customers);
    const brand = faker.helpers.arrayElement(Object.keys(VEHICLE_BRANDS));
    const model = faker.helpers.arrayElement(VEHICLE_BRANDS[brand]);

    // Spread bookings across the last 60 days, weighted toward recent days.
    const daysAgo = Math.floor(Math.pow(Math.random(), 1.5) * 60);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(faker.number.int({ min: 7, max: 20 }), faker.number.int({ min: 0, max: 59 }));

    const needsMechanic = status !== BookingStatus.PENDING;
    const mechanic = needsMechanic ? faker.helpers.arrayElement(mechanics) : null;

    const priceVariance = faker.number.float({ min: 0.85, max: 1.35, fractionDigits: 2 });
    const amount = Math.round(service.basePrice * priceVariance);

    const statusHistory = [{ status: BookingStatus.PENDING, changedAt: createdAt }];
    if (status !== BookingStatus.PENDING) {
      const assignedAt = new Date(createdAt.getTime() + 10 * 60 * 1000);
      statusHistory.push({ status: BookingStatus.ASSIGNED, changedAt: assignedAt });
    }
    if (status === BookingStatus.ON_THE_WAY || status === BookingStatus.COMPLETED) {
      const onTheWayAt = new Date(createdAt.getTime() + 20 * 60 * 1000);
      statusHistory.push({ status: BookingStatus.ON_THE_WAY, changedAt: onTheWayAt });
    }
    if (status === BookingStatus.COMPLETED) {
      const completedAt = new Date(createdAt.getTime() + 90 * 60 * 1000);
      statusHistory.push({ status: BookingStatus.COMPLETED, changedAt: completedAt });
    }
    if (status === BookingStatus.CANCELLED) {
      const cancelledAt = new Date(createdAt.getTime() + 15 * 60 * 1000);
      statusHistory.push({ status: BookingStatus.CANCELLED, changedAt: cancelledAt });
    }

    bookingDocs.push({
      bookingId: `BK-${1000 + i + 1}`,
      customer: customer._id,
      mechanic: mechanic?._id ?? null,
      service: service._id,
      vehicle: {
        brand,
        model,
        registrationNumber: randomRegistration(),
      },
      status,
      amount,
      statusHistory,
      scheduledAt: createdAt,
      createdAt,
      updatedAt: statusHistory[statusHistory.length - 1].changedAt,
    });
  }

  await Booking.insertMany(bookingDocs);

  console.log("[seed] done:");
  console.log(`  services:  ${services.length}`);
  console.log(`  customers: ${customers.length}`);
  console.log(`  mechanics: ${mechanics.length}`);
  console.log(`  bookings:  ${bookingDocs.length}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
