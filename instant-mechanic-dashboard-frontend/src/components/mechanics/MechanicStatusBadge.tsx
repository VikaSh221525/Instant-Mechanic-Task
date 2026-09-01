import { cn } from "@/lib/utils";
import { MechanicStatus } from "@/types/mechanic";

const STATUS_STYLES: Record<MechanicStatus, { bg: string; text: string; dot: string }> = {
  [MechanicStatus.AVAILABLE]: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  [MechanicStatus.BUSY]: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  [MechanicStatus.OFFLINE]: {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    dot: "bg-slate-400",
  },
};

const STATUS_LABELS: Record<MechanicStatus, string> = {
  [MechanicStatus.AVAILABLE]: "Available",
  [MechanicStatus.BUSY]: "Busy",
  [MechanicStatus.OFFLINE]: "Offline",
};

interface MechanicStatusBadgeProps {
  status: MechanicStatus;
}

export function MechanicStatusBadge({ status }: MechanicStatusBadgeProps) {
  const style = STATUS_STYLES[status] || STATUS_STYLES[MechanicStatus.OFFLINE];
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        style.bg,
        style.text
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      {label}
    </span>
  );
}
