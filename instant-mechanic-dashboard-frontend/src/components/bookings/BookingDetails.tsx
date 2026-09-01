"use client";

import { format } from "date-fns";
import { ArrowLeft, Car, User, Wrench, Clock } from "lucide-react";
import Link from "next/link";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { cn, formatCurrency } from "@/lib/utils";
import type { Booking } from "@/types/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";

interface BookingDetailsProps {
  booking: Booking | undefined;
  isLoading: boolean;
}

export function BookingDetails({ booking, isLoading }: BookingDetailsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Booking not found</p>
        <Link href="/bookings" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/bookings" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">
              {booking.bookingId}
            </h2>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Created {format(new Date(booking.createdAt), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(booking.amount)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Customer info */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-card-foreground">
              Customer
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name: </span>
              <span className="text-card-foreground">
                {booking.customer?.name || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              <span className="text-card-foreground">
                {booking.customer?.email || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Phone: </span>
              <span className="text-card-foreground">
                {booking.customer?.phone || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle info */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10">
              <Car className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-card-foreground">
              Vehicle
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Brand: </span>
              <span className="text-card-foreground">
                {booking.vehicle?.brand || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Model: </span>
              <span className="text-card-foreground">
                {booking.vehicle?.model || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Registration: </span>
              <span className="text-card-foreground font-mono">
                {booking.vehicle?.registrationNumber || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Service & Mechanic */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10">
              <Wrench className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-card-foreground">
              Service & Mechanic
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Service: </span>
              <span className="text-card-foreground">
                {booking.service?.name || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Category: </span>
              <span className="text-card-foreground">
                {booking.service?.category || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Mechanic: </span>
              <span className="text-card-foreground">
                {booking.mechanic?.name || "Unassigned"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      {booking.statusHistory && booking.statusHistory.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10">
              <Clock className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-card-foreground">
              Status Timeline
            </h3>
          </div>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-4">
              {booking.statusHistory.map((entry, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  <div className="w-[31px] flex justify-center shrink-0 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
                  </div>
                  <div>
                    <BookingStatusBadge
                      status={entry.status}
                      size="sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(
                        new Date(entry.changedAt),
                        "dd MMM yyyy, hh:mm a"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
