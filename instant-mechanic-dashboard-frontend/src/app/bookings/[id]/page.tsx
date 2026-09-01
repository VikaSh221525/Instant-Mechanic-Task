"use client";

import { use } from "react";
import { Header } from "@/components/layout/Header";
import { BookingDetails } from "@/components/bookings/BookingDetails";
import { useBooking } from "@/hooks/useBookings";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useBooking(id);

  return (
    <>
      <Header
        title={data?.bookingId || "Booking Details"}
        subtitle="Booking information"
      />
      <div className="p-4 lg:p-8">
        <BookingDetails booking={data} isLoading={isLoading} />
      </div>
    </>
  );
}
