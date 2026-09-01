import { Star, Briefcase } from "lucide-react";
import { MechanicStatusBadge } from "./MechanicStatusBadge";
import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";
import type { Mechanic } from "@/types/mechanic";
import type { BookingStatus } from "@/types/booking";

interface MechanicCardProps {
  mechanic: Mechanic;
}

export function MechanicCard({ mechanic }: MechanicCardProps) {
  const activeBooking = mechanic.currentBooking || mechanic.lastBooking;

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">
            {mechanic.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {mechanic.specialization}
          </p>
        </div>
        <MechanicStatusBadge status={mechanic.status} />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm text-card-foreground font-medium">
            {mechanic.jobsCompleted}
          </span>
          <span className="text-xs text-muted-foreground">jobs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-sm text-card-foreground font-medium">
            {mechanic.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Current/Last Booking */}
      {activeBooking && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1.5">
            {mechanic.currentBooking ? "Current Booking" : "Last Booking"}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary">
              {activeBooking.bookingId}
            </span>
            <BookingStatusBadge
              status={activeBooking.status as BookingStatus}
              size="sm"
            />
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground truncate">{mechanic.email}</p>
        <p className="text-xs text-muted-foreground">{mechanic.phone}</p>
      </div>
    </div>
  );
}
