import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StationShell } from "../components/StationShell";
import { stationById, type StationRenderProps } from "../data/stationsConfig";

type Phase = "intro" | "waiting" | "ready" | "clicked" | "toosoon" | "done";

const ROUNDS = 5;
const STATION = stationById("spiel")!;

/** Convert reaction time (ms) into station points. Faster = more points. */
function toPoints(ms: number): number {
  // 150ms → 200 pts, 500ms → 40 pts, 1200ms → 0 pts.
  const pts = Math.round(Math.max(0, 220 - (ms - 150) * 0.35));
  return Math.min(200, Math.max(0, pts));
}

export default function ReactionStation({ onComplete, onExit }: StationRenderProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const startRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  const startRound = useCallback(() => {
    setCurrent(null);
    setPhase("waiting");
    const delay = 900 + Math.random() * 2200;
    clearTimer();
    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setPhase("ready");
    }, delay);
  }, []);

  const startAll = () => {
    setRound(0);
    setTimes([]);
    setCurrent(null);
    startRound();
  };

  const handleClick = () => {
    if (phase === "intro" || phase === "done") return;
    if (phase === "waiting") {
      clearTimer();
      setPhase("toosoon");
      return;
    }
    if (phase === "ready") {
      const t = performance.now() - startRef.current;
      setCurrent(t);
      setTimes((prev) => [...prev, t]);
      setPhase("clicked");
    }
  };

  const next = () => {
    const nextRound = round + 1;
    if (nextRound >= ROUNDS) {
      setPhase("done");
      const total = [...times].reduce((s, t) => s + toPoints(t), 0);
      onComplete({ score: total, details: { times } });
    } else {
      setRound(nextRound);
      startRound();
    }
  };

  const retryRound = () => startRound();

  const totalScore = times.reduce((s, t) => s + toPoints(t), 0);
  const avg = times.length ? Math.round(times.reduce((s, t) => s + t, 0) / times.length) : 0;
  const best = times.length ? Math.round(Math.min(...times)) : 0;

  return (
    <StationShell
      emoji={STATION.emoji}
      title={STATION.title}
      intro="Warte, bis die Fläche grün wird. Dann so schnell wie möglich klicken. Zu früh geklickt = Runde ungültig."
      color={STATION.color}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Game area */}
        <div>
          <div className="text-sm text-ink-300 mb-2">
            Runde <span className="text-white font-semibold">{Math.min(round + 1, ROUNDS)}</span> /{" "}
            {ROUNDS}
          </div>
          <motion.button
            type="button"
            onClick={handleClick}
            disabled={phase === "intro" || phase === "done"}
            className={[
              "w-full aspect-[16/10] rounded-3xl border transition-colors duration-150 relative overflow-hidden",
              "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-400/40",
              phase === "waiting" &&
                "bg-rose-500/90 border-rose-300/40 cursor-crosshair",
              phase === "ready" &&
                "bg-emerald-500/90 border-emerald-300/50 cursor-pointer animate-pulse",
              phase === "clicked" &&
                "bg-brand-500/30 border-brand-400/40",
              phase === "toosoon" &&
                "bg-amber-500/30 border-amber-400/40",
              phase === "intro" &&
                "bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 border-white/20 cursor-default",
              phase === "done" &&
                "bg-gradient-to-br from-emerald-600 via-brand-700 to-indigo-800 border-white/20 cursor-default",
            ]
              .filter(Boolean)
              .join(" ")}
            whileTap={{ scale: phase === "ready" ? 0.98 : 1 }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <AnimatePresence mode="wait">
                {phase === "intro" && (
                  <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-5xl mb-3">⚡</div>
                    <div className="font-display text-2xl text-white">Bereit?</div>
                    <div className="mt-2 text-ink-100 max-w-md mx-auto">
                      Klicke auf „Los geht's" und warte, bis die Fläche <b>grün</b> wird.
                    </div>
                  </motion.div>
                )}
                {phase === "waiting" && (
                  <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="font-display text-3xl text-white">Warte…</div>
                    <div className="text-white/80 mt-1">Nicht zu früh klicken!</div>
                  </motion.div>
                )}
                {phase === "ready" && (
                  <motion.div key="ready" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <div className="font-display text-5xl text-white">JETZT!</div>
                  </motion.div>
                )}
                {phase === "clicked" && current !== null && (
                  <motion.div key="clicked" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="font-display text-3xl text-white">{Math.round(current)} ms</div>
                    <div className="text-ink-100 mt-1">+ {toPoints(current)} Punkte</div>
                  </motion.div>
                )}
                {phase === "toosoon" && (
                  <motion.div key="toosoon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="font-display text-3xl text-white">Zu früh!</div>
                    <div className="text-white/80 mt-1">Kein Punkt. Nochmal starten.</div>
                  </motion.div>
                )}
                {phase === "done" && (
                  <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-5xl mb-3">🏁</div>
                    <div className="font-display text-3xl text-white">Fertig!</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {phase === "intro" && (
              <button onClick={startAll} className="btn-primary px-5 py-3">
                Los geht's
              </button>
            )}
            {(phase === "clicked" || phase === "toosoon") && (
              <>
                {phase === "toosoon" ? (
                  <button onClick={retryRound} className="btn-primary px-5 py-3">
                    Runde wiederholen
                  </button>
                ) : (
                  <button onClick={next} className="btn-primary px-5 py-3">
                    {round + 1 >= ROUNDS ? "Auswerten" : "Nächste Runde"}
                  </button>
                )}
              </>
            )}
            {phase === "done" && (
              <>
                <button onClick={startAll} className="btn-secondary px-5 py-3">
                  Nochmal spielen
                </button>
                <button onClick={onExit} className="btn-primary px-5 py-3">
                  Zur Rallye
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <aside className="card p-6 h-fit">
          <div className="text-xs uppercase tracking-[0.16em] text-ink-300">Statistik</div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-display text-white">{best || "–"}</div>
              <div className="text-xs text-ink-300">Beste (ms)</div>
            </div>
            <div>
              <div className="text-2xl font-display text-white">{avg || "–"}</div>
              <div className="text-xs text-ink-300">Ø (ms)</div>
            </div>
            <div>
              <div className="text-2xl font-display text-accent-400">{totalScore}</div>
              <div className="text-xs text-ink-300">Punkte</div>
            </div>
          </div>
          <div className="divider my-5" />
          <ul className="space-y-1 text-sm">
            {Array.from({ length: ROUNDS }).map((_, i) => (
              <li key={i} className="flex items-center justify-between">
                <span className="text-ink-300">Runde {i + 1}</span>
                <span className="text-white font-mono">
                  {times[i] ? `${Math.round(times[i])} ms · +${toPoints(times[i])}` : "—"}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </StationShell>
  );
}
