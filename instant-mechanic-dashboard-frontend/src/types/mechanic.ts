export enum MechanicStatus {
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  OFFLINE = "OFFLINE",
}

export interface MechanicBookingRef {
  _id: string;
  bookingId: string;
  status: string;
  scheduledAt: string;
  amount?: number;
}

export interface Mechanic {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: MechanicStatus;
  jobsCompleted: number;
  rating: number;
  location?: { lat: number; lng: number };
  currentBooking: MechanicBookingRef | null;
  lastBooking: MechanicBookingRef | null;
  createdAt: string;
  updatedAt: string;
}

export interface MechanicFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: MechanicStatus | "";
}
