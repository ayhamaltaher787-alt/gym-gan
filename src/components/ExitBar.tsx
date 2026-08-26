import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

interface Props {
  title: string;
  subtitle?: string;
}

export function ExitBar({ title, subtitle }: Props) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-900/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/rallye")}
          className="btn-ghost px-3 py-2 text-sm"
          aria-label="Rallye verlassen"
        >
          <span aria-hidden>←</span> Rallye verlassen
        </button>
        <div className="hidden md:flex flex-col items-center leading-tight text-center">
          <div className="text-xs uppercase tracking-[0.18em] text-ink-300">
            {subtitle ?? "Station"}
          </div>
          <div className="font-display font-semibold text-white">{title}</div>
        </div>
        <Logo size="sm" />
      </div>
    </header>
  );
}
