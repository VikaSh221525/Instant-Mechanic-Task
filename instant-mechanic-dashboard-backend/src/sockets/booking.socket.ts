import { getIO } from "./index";
import { BookingStatus } from "../types";

export const SOCKET_EVENTS = {
  BOOKING_CREATED: "booking:created",
  BOOKING_UPDATED: "booking:updated",
  DASHBOARD_STATS_CHANGED: "dashboard:statsChanged",
} as const;

interface BookingUpdatedPayload {
  bookingId: string;
  oldStatus: BookingStatus | null;
  newStatus: BookingStatus;
  mechanicId?: string | null;
  updatedAt: string;
}

export function emitBookingCreated(booking: unknown) {
  getIO().emit(SOCKET_EVENTS.BOOKING_CREATED, booking);
  getIO().emit(SOCKET_EVENTS.DASHBOARD_STATS_CHANGED);
}

export function emitBookingUpdated(payload: BookingUpdatedPayload) {
  getIO().emit(SOCKET_EVENTS.BOOKING_UPDATED, payload);
  getIO().emit(SOCKET_EVENTS.DASHBOARD_STATS_CHANGED);
}
