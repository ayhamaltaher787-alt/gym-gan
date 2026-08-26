import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { STATIONS } from "../data/stationsConfig";
import { useRallyeStore, useRallyeStats } from "../store/rallyeStore";
import { ProgressBar } from "../components/ProgressBar";
import { StationCard } from "../components/StationCard";

export function RallyeOverviewPage() {
  const progress = useRallyeStore((s) => s.progress);
  const stats = useRallyeStats();
  const resetAll = useRallyeStore((s) => s.resetAll);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-w-[280px]"
        >
          <div className="chip mb-3">
            <span aria-hidden>🎯</span> Rallye
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Wähle deine nächste Station
          </h1>
          <p className="mt-2 text-ink-300 max-w-2xl">
            Jede Station ist ein eigenständiges Mini-Programm. Spiele sie in beliebiger Reihenfolge,
            verlasse und komm zurück – dein Fortschritt bleibt erhalten.
          </p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Link to="/" className="btn-secondary px-4 py-2 text-sm">
            ← Hauptmenü
          </Link>
          <button
            className="btn-ghost px-3 py-2 text-sm"
            onClick={() => {
              if (confirm("Wirklich den kompletten Rallye-Fortschritt zurücksetzen?")) {
                resetAll();
              }
            }}
            type="button"
          >
            ↺ Fortschritt zurücksetzen
          </button>
        </div>
      </div>

      {/* Progress card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-6 card p-6 flex flex-wrap items-center gap-6"
      >
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.16em] text-ink-300">
              Rallye-Fortschritt
            </div>
            <div className="text-sm text-ink-200">
              <span className="font-semibold text-white">
                {stats.completed} / {stats.total}
              </span>{" "}
              Stationen abgeschlossen
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={stats.percent} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.16em] text-ink-300">Punkte</div>
            <div className="font-display text-2xl text-white">
              {stats.totalScore}
              <span className="text-ink-400 text-base"> / {stats.totalMax}</span>
            </div>
          </div>
          {stats.isFinished && (
            <button
              onClick={() => navigate("/rallye/abschluss")}
              className="btn-accent px-5 py-3 text-sm"
              type="button"
            >
              🎉 Abschluss ansehen
            </button>
          )}
        </div>
      </motion.div>

      {/* Cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STATIONS.map((s, i) => (
          <StationCard key={s.id} station={s} progress={progress[s.id]} index={i} />
        ))}
      </div>

      {/* Bottom nav */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-ink-300">
          {stats.isFinished
            ? "Du hast alle Stationen abgeschlossen – Glückwunsch!"
            : `Noch ${stats.total - stats.completed} Station${
                stats.total - stats.completed === 1 ? "" : "en"
              } bis zum Abschluss.`}
        </div>
        <div className="flex gap-2">
          <Link to="/programme" className="btn-ghost px-4 py-2 text-sm">
            💻 Zu den Programmen
          </Link>
          <Link to="/praesentation" className="btn-ghost px-4 py-2 text-sm">
            🎬 Präsentationsmodus
          </Link>
        </div>
      </div>
    </div>
  );
}
