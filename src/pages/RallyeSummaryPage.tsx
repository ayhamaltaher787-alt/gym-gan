import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "../components/Confetti";
import { STATIONS } from "../data/stationsConfig";
import { useRallyeStore, useRallyeStats } from "../store/rallyeStore";
import { ProgressBar } from "../components/ProgressBar";

export function RallyeSummaryPage() {
  const progress = useRallyeStore((s) => s.progress);
  const stats = useRallyeStats();
  const navigate = useNavigate();

  return (
    <div className="relative">
      {stats.isFinished && <Confetti />}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-6xl mb-4">{stats.isFinished ? "🎉" : "🎯"}</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white">
            {stats.isFinished ? "Rallye abgeschlossen!" : "Rallye-Ergebnis"}
          </h1>
          <p className="mt-3 text-ink-300">
            {stats.isFinished
              ? "Du hast alle Stationen geschafft. Hier ist deine Bilanz."
              : `Du hast ${stats.completed} von ${stats.total} Stationen abgeschlossen – so weit bist du.`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-8 card p-6 sm:p-8 text-left"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-ink-300">
                Gesamtpunktzahl
              </div>
              <div className="font-display text-5xl text-white">
                {stats.totalScore}
                <span className="text-ink-400 text-2xl"> / {stats.totalMax}</span>
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <ProgressBar value={(stats.totalScore / stats.totalMax) * 100} />
            </div>
          </div>
          <div className="divider my-6" />
          <ul className="space-y-3">
            {STATIONS.map((s) => {
              const p = progress[s.id];
              return (
                <li key={s.id} className="flex items-center gap-4">
                  <span className="text-2xl" aria-hidden>
                    {s.emoji}
                  </span>
                  <div className="flex-1">
                    <div className="text-white font-medium">{s.title}</div>
                    <div className="text-xs text-ink-300">
                      {p.status === "completed"
                        ? `Abgeschlossen · ${p.attempts}× gespielt`
                        : p.status === "in_progress"
                        ? "In Bearbeitung"
                        : "Noch nicht gespielt"}
                    </div>
                  </div>
                  <div className="w-40 max-w-[40%]">
                    <ProgressBar value={(p.bestScore / s.maxPoints) * 100} />
                  </div>
                  <div className="w-20 text-right font-mono text-sm text-white">
                    {p.bestScore}
                    <span className="text-ink-400"> / {s.maxPoints}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <p className="text-lg text-ink-100">Wie hat dir unsere Rallye gefallen?</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/rallye/bewertung")}
              className="btn-accent px-6 py-3"
            >
              ⭐ Bewertung abgeben
            </button>
            <Link to="/rallye" className="btn-secondary px-6 py-3">
              🗺️ Zur Rallye
            </Link>
            <Link to="/" className="btn-ghost px-6 py-3">
              🏠 Hauptmenü
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
