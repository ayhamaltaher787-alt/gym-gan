import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import type { StationDefinition } from "../data/stationsConfig";
import { StatusBadge } from "./StatusBadge";
import type { StationProgress } from "../store/rallyeStore";

interface Props {
  station: StationDefinition;
  progress: StationProgress;
  index?: number;
}

export function StationCard({ station, progress, index = 0 }: Props) {
  const status = progress.status;
  const isCompleted = status === "completed";
  const cta = isCompleted ? "Erneut starten" : status === "in_progress" ? "Weiter" : "Starten";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group relative h-full"
    >
      <Link
        to={`/rallye/station/${station.id}`}
        className="block h-full card p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <div
          className={cn(
            "absolute inset-x-0 -top-px h-[3px] rounded-t-3xl bg-gradient-to-r opacity-70",
            station.color
          )}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl text-3xl",
              "bg-gradient-to-br shadow-glow",
              station.color
            )}
            aria-hidden
          >
            <span className="drop-shadow">{station.emoji}</span>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="mt-5">
          <h3 className="text-xl font-display font-semibold text-white">{station.title}</h3>
          <p className="mt-1 text-sm text-ink-200">{station.tagline}</p>
          <p className="mt-3 text-sm text-ink-300 line-clamp-3">{station.description}</p>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-ink-300">
            <span className="font-semibold text-white">≈{station.estimatedMinutes} Min.</span>
            {isCompleted && (
              <>
                {" · "}
                <span className="text-emerald-400 font-semibold">
                  {progress.bestScore} / {station.maxPoints} Pkt.
                </span>
              </>
            )}
          </div>
          <span className="btn-primary text-sm px-4 py-2 pointer-events-none group-hover:translate-x-0.5 transition-transform">
            {cta} <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
