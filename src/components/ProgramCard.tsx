import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ProgramItem } from "../store/programsStore";
import { formatDate } from "../lib/format";
import { cn } from "../lib/cn";

const CATEGORY_STYLE: Record<
  ProgramItem["category"],
  { label: string; color: string; emoji: string }
> = {
  spiel: { label: "Spiel", color: "from-fuchsia-500 to-brand-600", emoji: "🎮" },
  lernen: { label: "Lernen", color: "from-emerald-400 to-brand-600", emoji: "🧠" },
  ki: { label: "KI", color: "from-purple-500 to-rose-500", emoji: "🤖" },
  sonstiges: { label: "Sonstiges", color: "from-slate-500 to-slate-700", emoji: "🧩" },
};

const TYPE_LABEL: Record<ProgramItem["type"], string> = {
  scratch: "Scratch",
  web: "Web",
  game: "Spiel",
  other: "Sonstiges",
};

export function ProgramCard({ program, index = 0 }: { program: ProgramItem; index?: number }) {
  const c = CATEGORY_STYLE[program.category];
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="h-full"
    >
      <Link
        to={`/programme/${program.id}`}
        className="group block h-full card p-5 hover:border-white/20 hover:bg-white/[0.06] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-ink-800 to-ink-700 flex items-center justify-center">
          {program.thumbnail ? (
            <img
              src={program.thumbnail}
              alt={program.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "h-full w-full flex items-center justify-center text-6xl bg-gradient-to-br",
                c.color
              )}
            >
              <span className="drop-shadow-xl">{c.emoji}</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <span className="chip !py-0.5 !text-[10px] !bg-black/40 !border-white/20">
              {TYPE_LABEL[program.type]}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg text-white leading-tight line-clamp-1">
              {program.title}
            </h3>
          </div>
          <p className="mt-1 text-xs text-ink-300">
            von {program.author} · {formatDate(program.createdAt)}
          </p>
          <p className="mt-2 text-sm text-ink-200 line-clamp-2">{program.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="chip">{c.emoji} {c.label}</span>
          <span className="text-sm text-brand-300 group-hover:translate-x-0.5 transition-transform">
            ▶ Öffnen
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
