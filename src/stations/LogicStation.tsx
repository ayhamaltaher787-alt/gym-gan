import { useMemo, useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { StationShell } from "../components/StationShell";
import { stationById, type StationRenderProps } from "../data/stationsConfig";

const STATION = stationById("logik")!;

type MC = {
  kind: "mc";
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
};
type Order = {
  kind: "order";
  question: string;
  correctOrder: string[]; // The right sequence of code lines
  scrambled: string[];
};
type Puzzle = MC | Order;

const PUZZLES: Puzzle[] = [
  {
    kind: "mc",
    question: "Welche Aussage ist WAHR?",
    options: [
      "In JavaScript ist 0 == '0'",
      "In JavaScript ist 0 === '0'",
      "In JavaScript ist [] === []",
      "In JavaScript ist undefined === null",
    ],
    correctIndex: 0,
    hint: "== vergleicht mit Typumwandlung, === strikt.",
  },
  {
    kind: "mc",
    question: "Welche Reihenfolge zeigt eine korrekte if-else-Struktur?",
    options: [
      "if (x > 0) else { ... } { ... }",
      "if x > 0 { ... } else { ... }",
      "if (x > 0) { ... } else { ... }",
      "if { x > 0 } ( ... ) else ( ... )",
    ],
    correctIndex: 2,
  },
  {
    kind: "order",
    question: "Ordne die Zeilen so, dass die Funktion die Summe zweier Zahlen zurückgibt.",
    correctOrder: [
      "function summe(a, b) {",
      "  const ergebnis = a + b;",
      "  return ergebnis;",
      "}",
    ],
    scrambled: [
      "  return ergebnis;",
      "function summe(a, b) {",
      "}",
      "  const ergebnis = a + b;",
    ],
  },
  {
    kind: "mc",
    question: "Was gibt dieser Code aus?  \nlet x = 5;\nfor (let i = 0; i < 3; i++) x += 2;\nconsole.log(x);",
    options: ["5", "9", "10", "11"],
    correctIndex: 3,
  },
  {
    kind: "order",
    question: "Ordne die Schritte eines Login-Formulars in die richtige Reihenfolge.",
    correctOrder: [
      "Benutzer gibt E-Mail und Passwort ein",
      "Formular wird abgeschickt",
      "Server prüft die Daten",
      "Nutzer wird eingeloggt oder erhält Fehlermeldung",
    ],
    scrambled: [
      "Server prüft die Daten",
      "Nutzer wird eingeloggt oder erhält Fehlermeldung",
      "Benutzer gibt E-Mail und Passwort ein",
      "Formular wird abgeschickt",
    ],
  },
];

const PER_TASK = 100;

export default function LogicStation({ onComplete, onExit }: StationRenderProps) {
  const [idx, setIdx] = useState(0);
  const [points, setPoints] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [orderState, setOrderState] = useState<string[]>(
    PUZZLES[0].kind === "order" ? [...(PUZZLES[0] as Order).scrambled] : []
  );
  const [reveal, setReveal] = useState<null | "correct" | "wrong">(null);
  const [done, setDone] = useState(false);

  const current = PUZZLES[idx];
  const total = PUZZLES.length;

  const isCorrect = useMemo(() => {
    if (!current) return false;
    if (current.kind === "mc") return selected === current.correctIndex;
    return orderState.join("|") === current.correctOrder.join("|");
  }, [current, selected, orderState]);

  const check = () => {
    if (!current) return;
    if (isCorrect) setPoints((p) => p + PER_TASK);
    setReveal(isCorrect ? "correct" : "wrong");
  };

  const next = () => {
    setReveal(null);
    setSelected(null);
    const nextIdx = idx + 1;
    if (nextIdx >= total) {
      setDone(true);
      const final = points + (isCorrect ? 0 : 0); // points already added
      onComplete({ score: final, details: { correct: final / PER_TASK } });
      return;
    }
    setIdx(nextIdx);
    const p = PUZZLES[nextIdx];
    setOrderState(p.kind === "order" ? [...p.scrambled] : []);
  };

  const restart = () => {
    setIdx(0);
    setPoints(0);
    setSelected(null);
    setReveal(null);
    setDone(false);
    setOrderState(PUZZLES[0].kind === "order" ? [...(PUZZLES[0] as Order).scrambled] : []);
  };

  return (
    <StationShell
      emoji={STATION.emoji}
      title={STATION.title}
      intro="Fünf kleine Logik-/Programmier-Aufgaben. Multiple Choice und Sortieren – pro richtiger Aufgabe 100 Punkte."
      color={STATION.color}
    >
      {!done && current && (
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between text-sm text-ink-300">
            <span>
              Aufgabe <b className="text-white">{idx + 1}</b> / {total}
            </span>
            <span>
              Punkte: <b className="text-white">{points}</b>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="mt-4 font-display text-lg sm:text-xl text-white whitespace-pre-line">
                {current.question}
              </h2>

              {current.kind === "mc" && (
                <div className="mt-5 grid gap-3">
                  {current.options.map((opt, i) => {
                    const isChosen = selected === i;
                    const showResult = reveal !== null;
                    const isRight = i === current.correctIndex;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={showResult}
                        onClick={() => setSelected(i)}
                        className={[
                          "text-left rounded-2xl border px-4 py-4 transition-all font-mono text-sm",
                          isChosen && !showResult && "border-brand-400 bg-brand-500/15 text-white",
                          !isChosen && !showResult && "border-white/10 bg-white/[0.03] text-ink-100 hover:border-white/20",
                          showResult && isRight && "border-emerald-400 bg-emerald-500/15 text-white",
                          showResult && isChosen && !isRight && "border-rose-400 bg-rose-500/15 text-white",
                          showResult && !isChosen && !isRight && "opacity-50",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {current.kind === "order" && (
                <div className="mt-5">
                  <p className="text-sm text-ink-300 mb-3">
                    Ziehe die Zeilen in die richtige Reihenfolge.
                  </p>
                  <Reorder.Group
                    axis="y"
                    values={orderState}
                    onReorder={setOrderState}
                    className="grid gap-2"
                  >
                    {orderState.map((line) => (
                      <Reorder.Item
                        key={line}
                        value={line}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white cursor-grab active:cursor-grabbing select-none flex items-center gap-3"
                      >
                        <span className="text-ink-400">⋮⋮</span>
                        <span className="whitespace-pre">{line}</span>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              )}

              {reveal && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    "mt-5 rounded-xl px-4 py-3 text-sm " +
                    (reveal === "correct"
                      ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-200 border border-rose-500/30")
                  }
                >
                  {reveal === "correct" ? "Richtig! +100 Punkte." : "Nicht ganz richtig – aber weiter geht's!"}
                  {current.kind === "mc" && current.hint && reveal === "wrong" && (
                    <div className="mt-1 text-ink-200">Tipp: {current.hint}</div>
                  )}
                  {current.kind === "order" && reveal === "wrong" && (
                    <div className="mt-2 font-mono text-xs text-ink-200 whitespace-pre">
                      {current.correctOrder.join("\n")}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-end gap-3">
            {reveal === null ? (
              <button
                onClick={check}
                disabled={current.kind === "mc" && selected === null}
                className="btn-primary px-5 py-3"
              >
                Prüfen
              </button>
            ) : (
              <button onClick={next} className="btn-primary px-5 py-3">
                {idx + 1 >= total ? "Auswerten" : "Nächste Aufgabe"}
              </button>
            )}
          </div>
        </div>
      )}

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 sm:p-10 text-center"
        >
          <div className="text-5xl">🧠</div>
          <h2 className="mt-3 font-display text-3xl text-white">{points} Punkte</h2>
          <p className="mt-2 text-ink-200">
            {points / PER_TASK} von {total} Aufgaben richtig
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="btn-secondary px-5 py-3">
              Nochmal probieren
            </button>
            <button onClick={onExit} className="btn-primary px-5 py-3">
              Zur Rallye
            </button>
          </div>
        </motion.div>
      )}
    </StationShell>
  );
}
