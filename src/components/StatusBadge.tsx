import { cn } from "../lib/cn";
import type { StationStatus } from "../store/rallyeStore";

const map: Record<StationStatus, { label: string; className: string; dot: string }> = {
  idle: {
    label: "Noch nicht gespielt",
    className: "bg-white/5 text-ink-200 border-white/10",
    dot: "bg-ink-300",
  },
  in_progress: {
    label: "In Bearbeitung",
    className: "bg-accent-500/15 text-accent-400 border-accent-500/30",
    dot: "bg-accent-500",
  },
  completed: {
    label: "Abgeschlossen",
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
};

export function StatusBadge({ status }: { status: StationStatus }) {
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        s.className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", s.dot)} aria-hidden />
      {s.label}
    </span>
  );
}
