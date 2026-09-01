import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  mongodbUri: required(
    "MONGODB_URI",
    "mongodb://localhost:27017/instant_mechanic"
  ),
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  enableLiveSimulation: process.env.ENABLE_LIVE_SIMULATION === "true",
  simulationIntervalMs: parseInt(
    process.env.SIMULATION_INTERVAL_MS || "8000",
    10
  ),
  isProduction: process.env.NODE_ENV === "production",
};
