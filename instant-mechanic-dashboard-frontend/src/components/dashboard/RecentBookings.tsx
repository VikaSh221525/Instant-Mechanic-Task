"use client";

import Link from "next/link";
import { useBookings } from "@/hooks/useBookings";
import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export function RecentBookings() {
  const { data, isLoading } = useBookings({ page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" });

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Recent Bookings
        </h3>
        <Link
          href="/bookings"
          className="text-xs text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {data?.data.map((booking) => (
            <Link
              key={booking._id}
              href={`/bookings/${booking._id}`}
              className="flex items-center gap-3 p-3 -mx-1 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-card-foreground">
                    {booking.bookingId}
                  </span>
                  <BookingStatusBadge status={booking.status} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {booking.customer?.name} · {booking.service?.name}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-card-foreground">
                  {formatCurrency(booking.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(booking.scheduledAt), "dd MMM")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
