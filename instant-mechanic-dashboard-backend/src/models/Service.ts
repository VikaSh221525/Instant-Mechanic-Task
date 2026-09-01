import { Schema, model, Document, Types } from "mongoose";

export interface IService extends Document {
  _id: Types.ObjectId;
  name: string;
  category: string;
  basePrice: number;
  estimatedDurationMins: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    basePrice: { type: Number, required: true, min: 0 },
    estimatedDurationMins: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const Service = model<IService>("Service", serviceSchema);
