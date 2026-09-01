import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types/booking";

const STATUS_STYLES: Record<BookingStatus, { bg: string; text: string; dot: string }> = {
  [BookingStatus.PENDING]: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  [BookingStatus.ASSIGNED]: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  [BookingStatus.ON_THE_WAY]: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    dot: "bg-violet-400",
  },
  [BookingStatus.COMPLETED]: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  [BookingStatus.CANCELLED]: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "Pending",
  [BookingStatus.ASSIGNED]: "Assigned",
  [BookingStatus.ON_THE_WAY]: "On the Way",
  [BookingStatus.COMPLETED]: "Completed",
  [BookingStatus.CANCELLED]: "Cancelled",
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "default";
}

export function BookingStatusBadge({
  status,
  size = "default",
}: BookingStatusBadgeProps) {
  const style = STATUS_STYLES[status] || STATUS_STYLES[BookingStatus.PENDING];
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        style.bg,
        style.text,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      {label}
    </span>
  );
}
