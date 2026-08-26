import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StationShell } from "../components/StationShell";
import { stationById, type StationRenderProps } from "../data/stationsConfig";

const STATION = stationById("ki")!;

interface Item {
  text: string;
  by: "mensch" | "ki";
  hint?: string;
}

const ITEMS: Item[] = [
  {
    text: `„Am Sonntag saß ich mit meiner Oma in der Küche. Sie hat mir erzählt, wie sie als Kind Radio gehört hat, und dabei ihre kalten Hände an der Tasse gewärmt.“`,
    by: "mensch",
    hint: "Konkrete, alltägliche Details – schwer zu erfinden.",
  },
  {
    text: `„In der heutigen digitalen Welt spielen soziale Medien eine wichtige Rolle. Sie ermöglichen es Menschen, sich global zu vernetzen und Informationen effizient auszutauschen.“`,
    by: "ki",
    hint: "Sehr generisch, viele allgemeine Phrasen.",
  },
  {
    text: `„Der Kaffee war heute wieder zu bitter, aber ich mag ihn trotzdem. Vielleicht weil er mich an die Bäckerei erinnert, in der ich mit 15 gejobbt habe.“`,
    by: "mensch",
    hint: "Persönliche Erinnerung, keine Standardstruktur.",
  },
  {
    text: `„Zusammenfassend lässt sich sagen, dass die Vor- und Nachteile sorgfältig gegeneinander abgewogen werden sollten, um eine fundierte Entscheidung zu treffen.“`,
    by: "ki",
    hint: "Klassische Aufsatz-Floskel, sehr symmetrisch.",
  },
  {
    text: `„Ich habe gestern beim Fußball ein Eigentor geschossen. Meine Mitspieler haben zuerst gelacht, dann eine halbe Stunde nicht mit mir geredet.“`,
    by: "mensch",
    hint: "Unangenehme, spezifische Situation – wirkt echt.",
  },
];

export default function AIStation({ onComplete, onExit }: StationRenderProps) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<("mensch" | "ki")[]>([]);
  const [reveal, setReveal] = useState<null | "shown">(null);
  const [done, setDone] = useState(false);

  const item = ITEMS[idx];
  const total = ITEMS.length;

  const correctCount = useMemo(
    () => answers.filter((a, i) => a === ITEMS[i].by).length,
    [answers]
  );

  const answer = (choice: "mensch" | "ki") => {
    setAnswers((prev) => [...prev, choice]);
    setReveal("shown");
  };

  const next = () => {
    setReveal(null);
    const nextIdx = idx + 1;
    if (nextIdx >= total) {
      const c = answers.filter((a, i) => a === ITEMS[i].by).length;
      const score = Math.round((c / total) * 500);
      setDone(true);
      onComplete({ score, details: { correct: c } });
    } else {
      setIdx(nextIdx);
    }
  };

  const restart = () => {
    setIdx(0);
    setAnswers([]);
    setReveal(null);
    setDone(false);
  };

  return (
    <StationShell
      emoji={STATION.emoji}
      title={STATION.title}
      intro="Fünf kurze Texte – rate, ob ein Mensch oder eine KI sie geschrieben hat. Am Ende gibt's die Auflösung."
      color={STATION.color}
    >
      {!done && item && (
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between text-sm text-ink-300">
            <span>
              Text <b className="text-white">{idx + 1}</b> / {total}
            </span>
            <span>
              Bisher richtig: <b className="text-white">{correctCount}</b>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mt-5"
            >
              <blockquote className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-6 text-lg text-white leading-relaxed">
                {item.text}
              </blockquote>

              {reveal ? (
                <div className="mt-6">
                  <div
                    className={
                      "rounded-xl px-4 py-3 text-sm " +
                      (answers[idx] === item.by
                        ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-200 border border-rose-500/30")
                    }
                  >
                    {answers[idx] === item.by ? "Richtig!" : "Knapp daneben."} Diese Aussage kam von{" "}
                    <b>{item.by === "mensch" ? "einem Menschen" : "einer KI"}</b>.
                  </div>
                  {item.hint && (
                    <p className="mt-2 text-sm text-ink-300">Warum: {item.hint}</p>
                  )}
                  <div className="mt-5 flex justify-end">
                    <button onClick={next} className="btn-primary px-5 py-3">
                      {idx + 1 >= total ? "Auswerten" : "Weiter"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => answer("mensch")}
                    className="btn-secondary px-5 py-4 text-base"
                  >
                    👤 Von einem Menschen
                  </button>
                  <button
                    onClick={() => answer("ki")}
                    className="btn-secondary px-5 py-4 text-base"
                  >
                    🤖 Von einer KI
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 sm:p-10 text-center"
        >
          <div className="text-5xl">🤖</div>
          <h2 className="mt-3 font-display text-3xl text-white">
            {correctCount} von {total} korrekt
          </h2>
          <p className="mt-2 text-ink-200">
            {correctCount === total
              ? "Beeindruckend – dich täuscht keine KI so schnell!"
              : correctCount >= 3
              ? "Solide Trefferquote. Bei KI-Texten hilft es, auf Floskeln zu achten."
              : "Gar nicht so einfach. Achte auf konkrete Details – die verrät KI selten."}
          </p>
          <div className="mt-6 mx-auto max-w-lg text-left">
            {ITEMS.map((it, i) => {
              const ok = answers[i] === it.by;
              return (
                <div
                  key={i}
                  className="py-2 border-b border-white/5 last:border-0 flex items-start gap-3 text-sm"
                >
                  <span className={ok ? "text-emerald-400" : "text-rose-400"}>{ok ? "✓" : "✕"}</span>
                  <div>
                    <div className="text-ink-100 line-clamp-2">{it.text}</div>
                    <div className="text-ink-300 mt-0.5">
                      Autor: <b className="text-white">{it.by === "mensch" ? "Mensch" : "KI"}</b>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="btn-secondary px-5 py-3">
              Nochmal spielen
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
