export enum BookingStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  ON_THE_WAY = "ON_THE_WAY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Vehicle {
  brand: string;
  model: string;
  registrationNumber: string;
}

export interface StatusHistoryEntry {
  status: BookingStatus;
  changedAt: string;
}

export interface PopulatedCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface PopulatedMechanic {
  _id: string;
  name: string;
  status: string;
}

export interface PopulatedService {
  _id: string;
  name: string;
  category: string;
  basePrice: number;
}

export interface Booking {
  _id: string;
  bookingId: string;
  customer: PopulatedCustomer;
  mechanic: PopulatedMechanic | null;
  service: PopulatedService;
  vehicle: Vehicle;
  status: BookingStatus;
  amount: number;
  statusHistory: StatusHistoryEntry[];
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingUpdatedPayload {
  bookingId: string;
  oldStatus: BookingStatus | null;
  newStatus: BookingStatus;
  mechanicId?: string | null;
  updatedAt: string;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: BookingStatus | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
}
