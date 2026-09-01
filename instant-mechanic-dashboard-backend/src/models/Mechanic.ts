import { Schema, model, Document, Types } from "mongoose";
import { MechanicStatus } from "../types";

export interface IMechanic extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: MechanicStatus;
  jobsCompleted: number;
  rating: number;
  location?: { lat: number; lng: number };
  createdAt: Date;
  updatedAt: Date;
}

const mechanicSchema = new Schema<IMechanic>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(MechanicStatus),
      default: MechanicStatus.AVAILABLE,
      index: true,
    },
    jobsCompleted: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

mechanicSchema.index({ name: "text", specialization: "text" });

export const Mechanic = model<IMechanic>("Mechanic", mechanicSchema);
