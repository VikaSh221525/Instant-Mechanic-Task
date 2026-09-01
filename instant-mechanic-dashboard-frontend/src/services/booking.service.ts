import { apiFetch, buildQueryString } from "@/lib/api";
import type { Booking, BookingFilters } from "@/types/booking";
import type { ApiResponse } from "@/types/api";

export async function getBookings(
  filters: BookingFilters = {}
): Promise<ApiResponse<Booking[]>> {
  const qs = buildQueryString({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    status: filters.status || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  return apiFetch<Booking[]>(`/bookings${qs}`);
}

export async function getBookingById(id: string): Promise<Booking> {
  const res = await apiFetch<Booking>(`/bookings/${id}`);
  return res.data;
}
