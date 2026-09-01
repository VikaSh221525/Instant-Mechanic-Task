import { FilterQuery, Types } from "mongoose";
import { Mechanic, IMechanic } from "../models/Mechanic";
import { Booking } from "../models/Booking";
import { ApiError } from "../utils/ApiError";
import { BookingStatus } from "../types";

export interface ListMechanicsQuery {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  status?: string;
}

export async function listMechanics(query: ListMechanicsQuery) {
  const filter: FilterQuery<IMechanic> = {};
  if (query.status) filter.status = query.status;
  if (query.search) filter.$text = { $search: query.search };

  const [items, total] = await Promise.all([
    Mechanic.find(filter)
      .sort({ jobsCompleted: -1 })
      .skip(query.skip)
      .limit(query.limit)
      .lean(),
    Mechanic.countDocuments(filter),
  ]);

  // Attach each mechanic's current/last booking for the dashboard card.
  const enriched = await Promise.all(
    items.map(async (mechanic) => {
      const currentBooking = await Booking.findOne({
        mechanic: mechanic._id,
        status: { $in: [BookingStatus.ASSIGNED, BookingStatus.ON_THE_WAY] },
      })
        .sort({ updatedAt: -1 })
        .select("bookingId status scheduledAt")
        .lean();

      const lastBooking = currentBooking
        ? null
        : await Booking.findOne({ mechanic: mechanic._id })
            .sort({ updatedAt: -1 })
            .select("bookingId status scheduledAt")
            .lean();

      return {
        ...mechanic,
        currentBooking: currentBooking || null,
        lastBooking: lastBooking || null,
      };
    })
  );

  return { items: enriched, total };
}

export async function getMechanicById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid mechanic id");
  }
  const mechanic = await Mechanic.findById(id).lean();
  if (!mechanic) {
    throw ApiError.notFound("Mechanic not found");
  }

  const recentBookings = await Booking.find({ mechanic: id })
    .sort({ updatedAt: -1 })
    .limit(10)
    .select("bookingId status amount scheduledAt")
    .lean();

  return { ...mechanic, recentBookings };
}
