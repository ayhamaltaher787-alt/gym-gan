import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { STATIONS } from "../data/stationsConfig";
import { useProgramsStore } from "../store/programsStore";
import { useRallyeStore } from "../store/rallyeStore";

export function PresenterPage() {
  const progress = useRallyeStore((s) => s.progress);
  const programs = useProgramsStore((s) => s.programs).slice(0, 8);
  const navigate = useNavigate();
  const resetAll = useRallyeStore((s) => s.resetAll);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="chip mb-2">🎬 Präsentation</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Präsentationsmodus
          </h1>
          <p className="mt-2 text-ink-300 max-w-2xl">
            Direktsprünge zu allen Stationen und Programmen – ideal, wenn du bei der Präsentation
            schnell zwischen Demos wechseln musst.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="btn-secondary px-4 py-2 text-sm">
            ← Hauptmenü
          </Link>
          <button
            onClick={() => {
              if (confirm("Fortschritt komplett zurücksetzen? Nur für die nächste Demo sinnvoll.")) {
                resetAll();
              }
            }}
            className="btn-ghost px-4 py-2 text-sm"
          >
            ↺ Rallye zurücksetzen
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-xs uppercase tracking-[0.18em] text-ink-300 mb-3">
          🎯 Rallye-Stationen
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STATIONS.map((s, i) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => navigate(`/rallye/station/${s.id}`)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              className={`text-left rounded-2xl border border-white/10 bg-gradient-to-br ${s.color} p-4 hover:shadow-glow transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-black/25 flex items-center justify-center text-xl">
                  {s.emoji}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-semibold text-white truncate">
                    {s.title}
                  </div>
                  <div className="text-xs text-white/80">
                    {progress[s.id].status === "completed"
                      ? `✓ ${progress[s.id].bestScore} Pkt.`
                      : `Direktstart · ${s.estimatedMinutes} Min.`}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs uppercase tracking-[0.18em] text-ink-300">
            💻 Programme (Schnellzugriff)
          </h2>
          <Link to="/programme" className="text-xs text-brand-300 hover:underline">
            Alle Programme →
          </Link>
        </div>
        {programs.length === 0 ? (
          <div className="card p-8 text-center text-ink-300">
            Noch keine Programme vorhanden.{" "}
            <Link to="/programme/neu" className="text-brand-300 hover:underline">
              Jetzt hinzufügen
            </Link>
            .
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => (
              <Link
                key={p.id}
                to={`/programme/${p.id}`}
                className="card p-4 hover:bg-white/[0.06] hover:border-white/20 transition-all"
              >
                <div className="text-2xl">
                  {p.category === "spiel"
                    ? "🎮"
                    : p.category === "lernen"
                    ? "🧠"
                    : p.category === "ki"
                    ? "🤖"
                    : "🧩"}
                </div>
                <div className="mt-2 font-display text-white truncate">{p.title}</div>
                <div className="text-xs text-ink-300 truncate">von {p.author}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-[0.18em] text-ink-300 mb-3">
          🚪 Weitere Sprünge
        </h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <Link to="/rallye" className="btn-secondary px-4 py-3 justify-start">
            🗺️ Rallye-Übersicht
          </Link>
          <Link to="/rallye/abschluss" className="btn-secondary px-4 py-3 justify-start">
            🏁 Abschluss-Seite
          </Link>
          <Link to="/rallye/bewertung" className="btn-secondary px-4 py-3 justify-start">
            ⭐ Bewertungs-Seite
          </Link>
          <Link to="/about" className="btn-secondary px-4 py-3 justify-start">
            ℹ️ Über das Projekt
          </Link>
        </div>
      </section>
    </div>
  );
}
