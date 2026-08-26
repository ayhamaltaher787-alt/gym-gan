import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgramsStore, type ProgramCategory } from "../store/programsStore";
import { SUPABASE_CONFIGURED } from "../lib/supabase";
import { ProgramCard } from "../components/ProgramCard";

const CATEGORIES: { key: "all" | ProgramCategory; label: string; emoji: string }[] = [
  { key: "all", label: "Alle", emoji: "✨" },
  { key: "spiel", label: "Spiele", emoji: "🎮" },
  { key: "lernen", label: "Lernen", emoji: "🧠" },
  { key: "ki", label: "KI", emoji: "🤖" },
  { key: "sonstiges", label: "Sonstiges", emoji: "🧩" },
];

export function ProgramsListPage() {
  const programs = useProgramsStore((s) => s.programs);
  const loading = useProgramsStore((s) => s.loading);
  const error = useProgramsStore((s) => s.error);
  const loadedOnce = useProgramsStore((s) => s.loadedOnce);
  const refresh = useProgramsStore((s) => s.refresh);

  const [category, setCategory] = useState<"all" | ProgramCategory>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!loadedOnce && !loading) {
      refresh();
    }
  }, [loadedOnce, loading, refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      );
    });
  }, [programs, category, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="chip mb-2">
            <span aria-hidden>💻</span> Programme
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Programm-Bibliothek
          </h1>
          <p className="mt-2 text-ink-300 max-w-2xl">
            Alle Programme aus unserer Projektwoche – ansehen, ausprobieren, herunterladen. Du
            kannst auch eigene Scratch-Projekte hinzufügen.
          </p>
        </motion.div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh()}
            className="btn-ghost px-3 py-2 text-sm"
            type="button"
            aria-label="Aktualisieren"
            disabled={loading}
          >
            {loading ? "…" : "↻"}
          </button>
          <Link to="/programme/neu" className="btn-primary px-5 py-3">
            + Programm hinzufügen
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={
                  "rounded-full px-3 py-1.5 text-sm border transition-all " +
                  (active
                    ? "bg-brand-500/20 border-brand-400 text-white"
                    : "bg-white/[0.03] border-white/10 text-ink-100 hover:bg-white/10")
                }
              >
                <span aria-hidden className="mr-1.5">
                  {c.emoji}
                </span>
                {c.label}
              </button>
            );
          })}
        </div>
        <div className="w-full sm:w-72">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Programme durchsuchen…"
            className="input"
          />
        </div>
      </div>

      {/* States */}
      {!SUPABASE_CONFIGURED && (
        <div className="mt-8 card p-6 border-amber-500/30 bg-amber-500/10">
          <h3 className="font-display text-lg text-amber-200">Supabase noch nicht verbunden</h3>
          <p className="mt-1 text-sm text-amber-100/90">
            Trage <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">VITE_SUPABASE_URL</code>{" "}
            und{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">VITE_SUPABASE_ANON_KEY</code>{" "}
            in <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">.env.local</code> (lokal)
            und in den Vercel-Environment-Variables ein. Details siehe README.
          </p>
        </div>
      )}

      {error && SUPABASE_CONFIGURED && (
        <div className="mt-8 card p-6 border-rose-500/30 bg-rose-500/10">
          <h3 className="font-display text-lg text-rose-200">Programme konnten nicht geladen werden</h3>
          <p className="mt-1 text-sm text-rose-100/90">{error}</p>
          <button onClick={() => refresh()} className="btn-secondary mt-3 px-4 py-2 text-sm">
            Erneut versuchen
          </button>
        </div>
      )}

      {loading && !error && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="card p-5 h-72 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-video rounded-xl bg-white/[0.06]" />
              <div className="mt-4 h-4 w-2/3 rounded bg-white/10" />
              <div className="mt-2 h-3 w-1/3 rounded bg-white/[0.06]" />
              <div className="mt-4 h-3 w-full rounded bg-white/[0.06]" />
              <div className="mt-1.5 h-3 w-5/6 rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="mt-16 text-center">
          <div className="text-5xl mb-3">🌱</div>
          <h2 className="font-display text-xl text-white">
            {programs.length === 0
              ? "Noch keine Programme in der Bibliothek"
              : "Keine Programme mit diesen Filtern"}
          </h2>
          <p className="mt-1 text-ink-300">
            {programs.length === 0 ? (
              <>
                Los geht's –{" "}
                <Link to="/programme/neu" className="text-brand-300 hover:underline">
                  füge das erste Scratch-Projekt hinzu
                </Link>
                .
              </>
            ) : (
              "Passe Filter oder Suche an."
            )}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProgramCard key={p.id} program={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
