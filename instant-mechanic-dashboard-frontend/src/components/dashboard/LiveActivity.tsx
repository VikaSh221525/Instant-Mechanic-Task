"use client";

import { ArrowRightLeft, Radio } from "lucide-react";
import { useSocketContext } from "@/providers/SocketProvider";
import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";
import { useBookings } from "@/hooks/useBookings";
import { Skeleton } from "@/components/ui/skeleton";
import type { BookingStatus, BookingUpdatedPayload } from "@/types/booking";

export function LiveActivity() {
  const { recentEvents, isConnected } = useSocketContext();
  const { data: initialData, isLoading } = useBookings({
    page: 1,
    limit: 6,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  // Build fallback events from recently updated bookings
  const initialEvents: BookingUpdatedPayload[] = (initialData?.data || []).map((b) => {
    const history = b.statusHistory || [];
    const lastEntry = history[history.length - 1];
    const prevEntry = history.length > 1 ? history[history.length - 2] : null;
    return {
      bookingId: b.bookingId,
      oldStatus: (prevEntry?.status as BookingStatus) || null,
      newStatus: b.status,
      mechanicId: b.mechanic?._id || null,
      updatedAt: lastEntry?.changedAt ? String(lastEntry.changedAt) : b.updatedAt,
    };
  });

  // Use live socket events if any received, otherwise display recent booking transitions
  const displayEvents = recentEvents.length > 0 ? recentEvents : initialEvents;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Live Activity
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Radio className={`w-3.5 h-3.5 ${isConnected ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
          <span>{isConnected ? "Listening" : "Connecting..."}</span>
        </div>
      </div>

      {isLoading && displayEvents.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : displayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <ArrowRightLeft className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">Waiting for updates…</p>
          <p className="text-xs mt-1">Status changes will appear here in real-time</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {displayEvents.slice(0, 8).map((event, i) => (
            <div
              key={`${event.bookingId}-${event.updatedAt}-${i}`}
              className="flex items-center gap-3 p-2 rounded-lg bg-secondary/40 hover:bg-secondary/70 transition-colors text-sm animate-in fade-in slide-in-from-top-1 duration-300"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                <ArrowRightLeft className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-card-foreground font-medium truncate">
                  {event.bookingId}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {event.oldStatus && (
                    <>
                      <BookingStatusBadge
                        status={event.oldStatus as BookingStatus}
                        size="sm"
                      />
                      <span className="text-muted-foreground text-xs">→</span>
                    </>
                  )}
                  <BookingStatusBadge
                    status={event.newStatus as BookingStatus}
                    size="sm"
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {event.updatedAt ? new Date(event.updatedAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                }) : "Just now"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
