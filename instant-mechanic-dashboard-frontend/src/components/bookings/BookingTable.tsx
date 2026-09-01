"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { formatCurrency } from "@/lib/utils";
import type { Booking } from "@/types/booking";
import type { Meta } from "@/types/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingTableProps {
  bookings: Booking[];
  meta?: Meta;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function BookingTable({
  bookings,
  meta,
  isLoading,
  onPageChange,
}: BookingTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No bookings found</p>
        <p className="text-xs text-muted-foreground mt-1">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">
              Booking ID
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Customer
            </TableHead>
            <TableHead className="text-muted-foreground font-medium hidden md:table-cell">
              Vehicle
            </TableHead>
            <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">
              Service
            </TableHead>
            <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">
              Mechanic
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">
              Amount
            </TableHead>
            <TableHead className="text-muted-foreground font-medium hidden sm:table-cell text-right">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking._id}
              className="border-border hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <TableCell>
                <Link
                  href={`/bookings/${booking._id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {booking.bookingId}
                </Link>
              </TableCell>
              <TableCell className="text-card-foreground">
                {booking.customer?.name || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground hidden md:table-cell">
                {booking.vehicle
                  ? `${booking.vehicle.brand} ${booking.vehicle.model}`
                  : "—"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-card-foreground">
                  {booking.service?.name || "—"}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground hidden lg:table-cell">
                {booking.mechanic?.name || "Unassigned"}
              </TableCell>
              <TableCell>
                <BookingStatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right font-medium text-card-foreground">
                {formatCurrency(booking.amount)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                {format(new Date(booking.scheduledAt), "dd MMM yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => onPageChange(meta.page - 1)}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => onPageChange(meta.page + 1)}
              className="border-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
