import { FilterQuery, SortOrder, Types } from "mongoose";
import { Booking, IBooking } from "../models/Booking";
import { Mechanic } from "../models/Mechanic";
import { Customer } from "../models/Customer";
import { Service } from "../models/Service";
import { ApiError } from "../utils/ApiError";
import { BOOKING_STATUS_TRANSITIONS, BookingStatus, MechanicStatus, Vehicle } from "../types";
import { emitBookingCreated, emitBookingUpdated } from "../sockets/booking.socket";

export interface ListBookingsQuery {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  status?: string;
  mechanic?: string;
  customer?: string;
  sortBy?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
}

const SORTABLE_FIELDS = new Set([
  "createdAt",
  "scheduledAt",
  "amount",
  "status",
  "bookingId",
]);

export async function listBookings(query: ListBookingsQuery) {
  const filter: FilterQuery<IBooking> = {};

  if (query.status) {
    filter.status = query.status;
  }
  if (query.mechanic && Types.ObjectId.isValid(query.mechanic)) {
    filter.mechanic = query.mechanic;
  }
  if (query.customer && Types.ObjectId.isValid(query.customer)) {
    filter.customer = query.customer;
  }
  if (query.dateFrom || query.dateTo) {
    filter.scheduledAt = {};
    if (query.dateFrom) filter.scheduledAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.scheduledAt.$lte = new Date(query.dateTo);
  }
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sortField = SORTABLE_FIELDS.has(query.sortBy || "")
    ? (query.sortBy as string)
    : "createdAt";
  const sortOrder: SortOrder = query.sortOrder === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(query.skip)
      .limit(query.limit)
      .populate("customer", "name email phone")
      .populate("mechanic", "name status")
      .populate("service", "name category basePrice")
      .lean(),
    Booking.countDocuments(filter),
  ]);

  return { items, total };
}

export async function getBookingById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid booking id");
  }
  const booking = await Booking.findById(id)
    .populate("customer")
    .populate("mechanic")
    .populate("service")
    .lean();

  if (!booking) {
    throw ApiError.notFound("Booking not found");
  }
  return booking;
}

async function generateBookingId(): Promise<string> {
  const count = await Booking.countDocuments();
  return `BK-${1000 + count + 1}`;
}

interface CreateBookingInput {
  customer: string;
  mechanic?: string | null;
  service: string;
  vehicle: Vehicle;
  amount: number;
  scheduledAt: string | Date;
  status?: BookingStatus;
}

export async function createBooking(input: CreateBookingInput) {
  const bookingId = await generateBookingId();
  const status = input.status ?? BookingStatus.PENDING;

  const booking = await Booking.create({
    bookingId,
    customer: input.customer,
    mechanic: input.mechanic || null,
    service: input.service,
    vehicle: input.vehicle,
    amount: input.amount,
    scheduledAt: input.scheduledAt,
    status,
    statusHistory: [{ status, changedAt: new Date() }],
  });

  const populated = await booking.populate([
    { path: "customer", select: "name email phone" },
    { path: "mechanic", select: "name status" },
    { path: "service", select: "name category basePrice" },
  ]);

  emitBookingCreated(populated);
  return populated;
}

export async function updateBookingStatus(id: string, newStatus: BookingStatus) {
  if (!Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid booking id");
  }
  if (!Object.values(BookingStatus).includes(newStatus)) {
    throw ApiError.badRequest(`Invalid status: ${newStatus}`);
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    throw ApiError.notFound("Booking not found");
  }

  const allowedNext = BOOKING_STATUS_TRANSITIONS[booking.status];
  if (!allowedNext.includes(newStatus)) {
    throw ApiError.badRequest(
      `Cannot transition booking from ${booking.status} to ${newStatus}`
    );
  }

  const oldStatus = booking.status;
  booking.status = newStatus;
  booking.statusHistory.push({ status: newStatus, changedAt: new Date() });
  await booking.save();

  // Keep mechanic availability in sync with the booking lifecycle.
  if (booking.mechanic) {
    if (newStatus === BookingStatus.ASSIGNED || newStatus === BookingStatus.ON_THE_WAY) {
      await Mechanic.findByIdAndUpdate(booking.mechanic, {
        status: MechanicStatus.BUSY,
      });
    } else if (newStatus === BookingStatus.COMPLETED) {
      await Mechanic.findByIdAndUpdate(booking.mechanic, {
        status: MechanicStatus.AVAILABLE,
        $inc: { jobsCompleted: 1 },
      });
    } else if (newStatus === BookingStatus.CANCELLED) {
      await Mechanic.findByIdAndUpdate(booking.mechanic, {
        status: MechanicStatus.AVAILABLE,
      });
    }
  }

  emitBookingUpdated({
    bookingId: booking.bookingId,
    oldStatus,
    newStatus,
    mechanicId: booking.mechanic?.toString() ?? null,
    updatedAt: booking.updatedAt.toISOString(),
  });

  return booking;
}
