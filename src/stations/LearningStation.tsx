import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StationShell } from "../components/StationShell";
import { stationById, type StationRenderProps } from "../data/stationsConfig";

type MethodKey = "pomodoro" | "karteikarten" | "mindmap" | "sos";

interface Question {
  q: string;
  options: { label: string; scores: Partial<Record<MethodKey, number>> }[];
}

const STATION = stationById("lernen")!;

const questions: Question[] = [
  {
    q: "Wie lange kannst du dich am Stück konzentrieren, bevor du eine Pause brauchst?",
    options: [
      { label: "20–30 Minuten", scores: { pomodoro: 3 } },
      { label: "45–60 Minuten", scores: { mindmap: 2, sos: 1 } },
      { label: "Kommt drauf an, ich brauche Struktur", scores: { pomodoro: 2, karteikarten: 1 } },
      { label: "Über eine Stunde am Stück", scores: { mindmap: 2 } },
    ],
  },
  {
    q: "Wie merkst du dir am liebsten neuen Stoff?",
    options: [
      { label: "Wiederholen, wiederholen, wiederholen", scores: { karteikarten: 3 } },
      { label: "In eigenen Worten zusammenfassen", scores: { mindmap: 3 } },
      { label: "In Bildern und Farben", scores: { mindmap: 2, sos: 1 } },
      { label: "Kleine Häppchen, oft geübt", scores: { karteikarten: 2, pomodoro: 1 } },
    ],
  },
  {
    q: "Was hilft dir am meisten vor einer Prüfung?",
    options: [
      { label: "Alte Aufgaben durchrechnen", scores: { sos: 3 } },
      { label: "Vokabeln/Formeln abfragen lassen", scores: { karteikarten: 3 } },
      { label: "Ein Übersichtsplakat im Kopf", scores: { mindmap: 3 } },
      { label: "Mit Timer strukturiert lernen", scores: { pomodoro: 3 } },
    ],
  },
  {
    q: "Was nervt dich am meisten beim Lernen?",
    options: [
      { label: "Ich verzettel mich in Details", scores: { mindmap: 2, pomodoro: 1 } },
      { label: "Ich vergesse Dinge schnell wieder", scores: { karteikarten: 3 } },
      { label: "Ich weiß nicht, was wichtig ist", scores: { sos: 3 } },
      { label: "Ich verliere schnell die Motivation", scores: { pomodoro: 3 } },
    ],
  },
  {
    q: "Wie lernst du am liebsten?",
    options: [
      { label: "Allein und in Ruhe", scores: { karteikarten: 2, pomodoro: 1 } },
      { label: "Mit anderen zusammen", scores: { sos: 3 } },
      { label: "Kreativ, mit Farben und Skizzen", scores: { mindmap: 3 } },
      { label: "Ergebnisorientiert und effizient", scores: { pomodoro: 2, sos: 1 } },
    ],
  },
];

const methods: Record<MethodKey, { name: string; emoji: string; text: string }> = {
  pomodoro: {
    name: "Pomodoro-Technik",
    emoji: "⏱️",
    text: "25 Minuten konzentriert arbeiten, 5 Minuten Pause. Perfekt, wenn du sonst schnell die Motivation verlierst.",
  },
  karteikarten: {
    name: "Karteikarten",
    emoji: "🗂️",
    text: "Kurze Frage vorn, Antwort hinten, regelmäßig wiederholen. Ideal für Vokabeln, Formeln, Fakten.",
  },
  mindmap: {
    name: "Mindmap",
    emoji: "🗺️",
    text: "Themen als Karte mit Ästen und Farben. Super, um Zusammenhänge zu sehen und Überblick zu behalten.",
  },
  sos: {
    name: "Selbstlernzentrum & Übungsaufgaben",
    emoji: "📚",
    text: "Alte Aufgaben durchgehen, in Ruhe im Selbstlernzentrum arbeiten – am besten mit einer Lerngruppe.",
  },
};

export default function LearningStation({ onComplete, onExit }: StationRenderProps) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const current = answers.length;
  const total = questions.length;
  const progress = Math.round((current / total) * 100);

  const scores = useMemo(() => {
    const s: Record<MethodKey, number> = { pomodoro: 0, karteikarten: 0, mindmap: 0, sos: 0 };
    answers.forEach((ai, qi) => {
      const opt = questions[qi]?.options[ai];
      if (!opt) return;
      for (const k of Object.keys(opt.scores) as MethodKey[]) {
        s[k] += opt.scores[k] ?? 0;
      }
    });
    return s;
  }, [answers]);

  const top = useMemo(() => {
    const entries = Object.entries(scores) as [MethodKey, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries;
  }, [scores]);

  const bestKey = top[0]?.[0] ?? "pomodoro";
  const bestMethod = methods[bestKey];

  const choose = (index: number) => {
    const nextAnswers = [...answers, index];
    setAnswers(nextAnswers);
    if (nextAnswers.length === total) {
      // Score = points based on how "decisive" the profile is (max 100)
      const max = Math.max(...Object.values(scores));
      const sum = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
      const decisiveness = Math.round((max / sum) * 100);
      setDone(true);
      onComplete({ score: Math.min(100, 60 + decisiveness / 2.5), details: { scores } });
    }
  };

  const reset = () => {
    setAnswers([]);
    setDone(false);
  };

  return (
    <StationShell
      emoji={STATION.emoji}
      title={STATION.title}
      intro="Beantworte 5 Fragen ehrlich – am Ende schlagen wir dir eine Lernmethode vor."
      color={STATION.color}
    >
      {!done ? (
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between text-sm text-ink-300">
            <span>
              Frage <b className="text-white">{current + 1}</b> / {total}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="mt-6"
            >
              <h2 className="font-display text-xl sm:text-2xl text-white">
                {questions[current].q}
              </h2>
              <div className="mt-5 grid gap-3">
                {questions[current].options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => choose(i)}
                    className="text-left rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 hover:border-brand-400 hover:bg-white/[0.06] transition-all"
                  >
                    <span className="text-white">{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 sm:p-10"
        >
          <div className="text-center">
            <div className="text-5xl">{bestMethod.emoji}</div>
            <div className="text-xs uppercase tracking-[0.18em] text-ink-300 mt-3">
              Deine passende Lernmethode
            </div>
            <h2 className="mt-1 font-display text-3xl text-white">{bestMethod.name}</h2>
            <p className="mt-3 text-ink-200 max-w-lg mx-auto">{bestMethod.text}</p>
          </div>
          <div className="mt-8 grid gap-2 max-w-md mx-auto">
            {top.map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <span className="w-40 text-sm text-ink-200">
                  {methods[k].emoji} {methods[k].name}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
                    style={{
                      width: `${
                        Math.min(100, (v / Math.max(1, top[0][1])) * 100)
                      }%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right text-sm text-ink-300">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={reset} className="btn-secondary px-5 py-3">
              Nochmal beantworten
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
