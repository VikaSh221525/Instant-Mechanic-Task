"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BookingFiltersBar } from "@/components/bookings/BookingFilters";
import { BookingTable } from "@/components/bookings/BookingTable";
import { useBookings } from "@/hooks/useBookings";
import type { BookingFilters } from "@/types/booking";

export default function BookingsPage() {
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading } = useBookings(filters);

  return (
    <>
      <Header
        title="Bookings"
        subtitle={data?.meta ? `${data.meta.total} total bookings` : undefined}
      />
      <div className="p-4 lg:p-8 space-y-6">
        <BookingFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
        />
        <BookingTable
          bookings={data?.data || []}
          meta={data?.meta}
          isLoading={isLoading}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      </div>
    </>
  );
}
