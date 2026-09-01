export enum BookingStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  ON_THE_WAY = "ON_THE_WAY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum MechanicStatus {
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  OFFLINE = "OFFLINE",
}

// Valid forward transitions for a booking's lifecycle.
// Used to reject nonsensical status updates (e.g. COMPLETED -> PENDING).
export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.ASSIGNED, BookingStatus.CANCELLED],
  [BookingStatus.ASSIGNED]: [BookingStatus.ON_THE_WAY, BookingStatus.CANCELLED],
  [BookingStatus.ON_THE_WAY]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: [],
};

export interface Vehicle {
  brand: string;
  model: string;
  registrationNumber: string;
}
