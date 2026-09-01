import mongoose from "mongoose";
import { env } from "./env";

mongoose.set("strictQuery", true);

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log(`[db] MongoDB connected -> ${mongoose.connection.name}`);
  } catch (error) {
    console.error("[db] MongoDB connection failed:", error);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB error:", err);
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
