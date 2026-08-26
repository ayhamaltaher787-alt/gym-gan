import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRallyeStats } from "../store/rallyeStore";
import { useProgramsStore } from "../store/programsStore";
import { SUPABASE_CONFIGURED } from "../lib/supabase";

const heroSpring = { type: "spring", stiffness: 120, damping: 20 };

export function HomePage() {
  const stats = useRallyeStats();
  const programsCount = useProgramsStore((s) => s.programs.length);
  const programsLoading = useProgramsStore((s) => s.loading);
  const programsLoaded = useProgramsStore((s) => s.loadedOnce);
  const navigate = useNavigate();

  const programsSubtitle = !SUPABASE_CONFIGURED
    ? "Cloud-Bibliothek · Setup ausstehend"
    : programsLoading && !programsLoaded
    ? "Cloud-Bibliothek lädt …"
    : programsCount === 0
    ? "Cloud-Bibliothek · noch leer"
    : `${programsCount} Programm${programsCount === 1 ? "" : "e"} · Cloud-synchron`;

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/30 blur-[120px]" />
        <div className="absolute top-40 -right-32 h-[420px] w-[420px] rounded-full bg-accent-500/20 blur-[100px]" />
      </div>

      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="chip mx-auto mb-6"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Projektwoche · Programmieren
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={heroSpring}
          className="font-display text-6xl sm:text-8xl font-bold tracking-tight text-white"
        >
          GYM{" "}
          <span className="inline-block bg-gradient-to-br from-brand-400 via-brand-300 to-accent-400 bg-clip-text text-transparent">
            GAN
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...heroSpring, delay: 0.05 }}
          className="mt-4 text-lg sm:text-xl text-ink-200"
        >
          Interaktive Programmier-Rallye
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...heroSpring, delay: 0.1 }}
          className="mt-3 max-w-2xl mx-auto text-ink-300"
        >
          Entdecke unsere Programme, löse Challenges und probiere verschiedene interaktive
          Stationen aus.
        </motion.p>

        {/* Two big primary options */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
          }}
          className="mt-12 grid gap-5 sm:grid-cols-2 max-w-3xl mx-auto"
        >
          <BigOption
            to="/rallye"
            emoji="🎯"
            title="Rallye starten"
            subtitle={
              stats.completed > 0
                ? `${stats.completed}/${stats.total} Stationen geschafft`
                : `${stats.total} Stationen · voll interaktiv`
            }
            accent="from-brand-500 to-brand-700"
          />
          <BigOption
            to="/programme"
            emoji="💻"
            title="Programme ansehen"
            subtitle={programsSubtitle}
            accent="from-accent-500 to-rose-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-4 text-sm"
        >
          <Link to="/about" className="btn-ghost px-4 py-2">
            Über das Projekt
          </Link>
          <button
            onClick={() => navigate("/praesentation")}
            className="btn-ghost px-4 py-2"
            type="button"
          >
            🎬 Präsentationsmodus
          </button>
        </motion.div>
      </section>

      {/* Highlights */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          <MiniStat
            title="Rallye-Fortschritt"
            value={`${stats.completed} / ${stats.total}`}
            hint={stats.isFinished ? "Alle Stationen geschafft" : "Stationen abgeschlossen"}
          />
          <MiniStat
            title="Gesamtpunkte"
            value={`${stats.totalScore}`}
            hint={`von ${stats.totalMax} möglich`}
          />
          <MiniStat
            title="Programme in der Bibliothek"
            value={
              !SUPABASE_CONFIGURED
                ? "—"
                : programsLoading && !programsLoaded
                ? "…"
                : `${programsCount}`
            }
            hint={
              !SUPABASE_CONFIGURED
                ? "Supabase noch nicht verbunden"
                : "Scratch & eigene Projekte"
            }
          />
        </div>
      </section>
    </div>
  );
}

function BigOption({
  to,
  emoji,
  title,
  subtitle,
  accent,
}: {
  to: string;
  emoji: string;
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } },
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
    >
      <Link
        to={to}
        className="group block h-full text-left card p-7 hover:border-white/20 hover:bg-white/[0.06] transition-all"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-3xl shadow-glow`}
          >
            {emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-2xl font-semibold text-white">{title}</div>
            <div className="mt-1 text-sm text-ink-300">{subtitle}</div>
          </div>
          <div className="text-white/70 text-2xl group-hover:translate-x-1 transition-transform">
            →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function MiniStat({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-[0.16em] text-ink-300">{title}</div>
      <div className="mt-2 font-display text-3xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-ink-400">{hint}</div>
    </div>
  );
}
