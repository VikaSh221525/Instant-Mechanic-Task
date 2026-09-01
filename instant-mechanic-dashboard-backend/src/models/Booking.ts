import { Schema, model, Document, Types } from "mongoose";
import { BookingStatus, Vehicle } from "../types";

export interface IStatusHistoryEntry {
  status: BookingStatus;
  changedAt: Date;
}

export interface IBooking extends Document {
  _id: Types.ObjectId;
  bookingId: string; // human readable, e.g. BK-1024
  customer: Types.ObjectId;
  mechanic?: Types.ObjectId | null;
  service: Types.ObjectId;
  vehicle: Vehicle;
  status: BookingStatus;
  amount: number;
  statusHistory: IStatusHistoryEntry[];
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<Vehicle>(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    registrationNumber: { type: String, required: true },
  },
  { _id: false }
);

const statusHistorySchema = new Schema<IStatusHistoryEntry>(
  {
    status: { type: String, enum: Object.values(BookingStatus), required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    mechanic: { type: Schema.Types.ObjectId, ref: "Mechanic", default: null },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    vehicle: { type: vehicleSchema, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    statusHistory: { type: [statusHistorySchema], default: [] },
    scheduledAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// Compound indexes to keep filtering/sorting fast at 500+ bookings and beyond.
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ mechanic: 1, status: 1 });
bookingSchema.index({ customer: 1 });
bookingSchema.index({
  bookingId: "text",
  "vehicle.registrationNumber": "text",
  "vehicle.brand": "text",
  "vehicle.model": "text",
});

export const Booking = model<IBooking>("Booking", bookingSchema);
