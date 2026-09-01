import { useQuery } from "@tanstack/react-query";
import { getBookings, getBookingById } from "@/services/booking.service";
import type { BookingFilters } from "@/types/booking";

export function useBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => getBookings(filters),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
}
