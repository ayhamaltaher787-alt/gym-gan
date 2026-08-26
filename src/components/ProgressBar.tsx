import { motion } from "framer-motion";
import { cn } from "../lib/cn";

interface Props {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, showLabel }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      <div className="h-3 w-full rounded-full bg-white/[0.06] overflow-hidden relative">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 via-accent-500 to-brand-400"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-ink-300">{clamped}%</div>
      )}
    </div>
  );
}
