import { cn } from "../lib/cn";
import type { ReactNode } from "react";

interface Props {
  emoji: string;
  title: string;
  intro?: string;
  color: string;
  children: ReactNode;
  className?: string;
}

export function StationShell({ emoji, title, intro, color, children, className }: Props) {
  return (
    <section className={cn("max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10", className)}>
      <header className="flex flex-wrap items-start gap-4 mb-8">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl text-3xl bg-gradient-to-br shadow-glow",
            color
          )}
        >
          {emoji}
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-ink-300">Station</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{title}</h1>
          {intro && <p className="mt-1 text-ink-300 max-w-2xl">{intro}</p>}
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}
