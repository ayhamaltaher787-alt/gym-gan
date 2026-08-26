import { cn } from "../lib/cn";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: Props) {
  const box = size === "sm" ? "h-8 w-8 text-sm" : size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-base";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "rounded-2xl flex items-center justify-center font-display font-bold text-white",
          "bg-gradient-to-br from-brand-500 to-accent-500 shadow-glow",
          box
        )}
      >
        GG
      </div>
      <div className="leading-tight">
        <div className="font-display font-bold text-white tracking-tight">GYM GAN</div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300">
          Programmier-Rallye
        </div>
      </div>
    </div>
  );
}
