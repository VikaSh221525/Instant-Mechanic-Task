import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { getPagination, buildMeta } from "../utils/pagination";
import { ApiError } from "../utils/ApiError";
import { BookingStatus } from "../types";
import * as bookingService from "../services/booking.service";

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const { items, total } = await bookingService.listBookings({
    page,
    limit,
    skip,
    search: req.query.search ? String(req.query.search) : undefined,
    status: req.query.status ? String(req.query.status) : undefined,
    mechanic: req.query.mechanic ? String(req.query.mechanic) : undefined,
    customer: req.query.customer ? String(req.query.customer) : undefined,
    sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined,
    sortOrder: req.query.sortOrder ? String(req.query.sortOrder) : undefined,
    dateFrom: req.query.dateFrom ? String(req.query.dateFrom) : undefined,
    dateTo: req.query.dateTo ? String(req.query.dateTo) : undefined,
  });
  sendSuccess(res, items, buildMeta(page, limit, total));
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.getBookingById(req.params.id);
  sendSuccess(res, booking);
});

const vehicleSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  registrationNumber: z.string().min(1),
});

const createBookingSchema = z.object({
  customer: z.string().min(1),
  mechanic: z.string().optional().nullable(),
  service: z.string().min(1),
  vehicle: vehicleSchema,
  amount: z.number().nonnegative(),
  scheduledAt: z.string().or(z.date()),
  status: z.nativeEnum(BookingStatus).optional(),
});

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest("Invalid booking payload", parsed.error.flatten());
  }
  const booking = await bookingService.createBooking(parsed.data);
  sendSuccess(res, booking, undefined, 201);
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest("Invalid status payload", parsed.error.flatten());
  }
  const booking = await bookingService.updateBookingStatus(
    req.params.id,
    parsed.data.status
  );
  sendSuccess(res, booking);
});
