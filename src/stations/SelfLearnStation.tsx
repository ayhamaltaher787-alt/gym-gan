import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StationShell } from "../components/StationShell";
import { stationById, type StationRenderProps } from "../data/stationsConfig";

const STATION = stationById("selbstlernen")!;

type Subject = "mathe" | "deutsch" | "englisch" | "nw";

interface Task {
  question: string;
  options: string[];
  correctIndex: number;
}

const TASKS: Record<Subject, { title: string; emoji: string; tasks: Task[] }> = {
  mathe: {
    title: "Mathematik",
    emoji: "🧮",
    tasks: [
      { question: "Was ist 17 · 6?", options: ["82", "92", "102", "112"], correctIndex: 2 },
      {
        question: "Wie viel Prozent sind 3/4?",
        options: ["25 %", "50 %", "75 %", "80 %"],
        correctIndex: 2,
      },
      { question: "√144 = ?", options: ["10", "12", "14", "16"], correctIndex: 1 },
      { question: "Wie viel ist 2⁵?", options: ["10", "16", "25", "32"], correctIndex: 3 },
      {
        question:
          "Ein Dreieck hat 180° Innenwinkelsumme. Zwei Winkel sind 60° und 70°. Wie groß ist der dritte?",
        options: ["30°", "40°", "50°", "60°"],
        correctIndex: 2,
      },
    ],
  },
  deutsch: {
    title: "Deutsch",
    emoji: "📖",
    tasks: [
      {
        question: "Welches Wort ist ein Nomen?",
        options: ["schnell", "laufen", "Straße", "grün"],
        correctIndex: 2,
      },
      {
        question: `„Er geht ins Kino.“ – Welche Zeitform?`,
        options: ["Präsens", "Präteritum", "Perfekt", "Futur"],
        correctIndex: 0,
      },
      {
        question: "Welche Aussage ist ein Nebensatz?",
        options: [
          "Ich lerne heute.",
          "Weil ich morgen eine Prüfung habe.",
          "Es regnet.",
          "Ich mag Musik.",
        ],
        correctIndex: 1,
      },
      {
        question: "Welches Wort ist richtig geschrieben?",
        options: ["Rythmus", "Rhytmus", "Rhythmus", "Rhythumus"],
        correctIndex: 2,
      },
      {
        question: "Was ist eine Metapher?",
        options: [
          `Ein direkter Vergleich mit „wie“`,
          `Ein sprachliches Bild ohne „wie“`,
          "Ein wörtliches Zitat",
          "Ein Nomen",
        ],
        correctIndex: 1,
      },
    ],
  },
  englisch: {
    title: "Englisch",
    emoji: "🇬🇧",
    tasks: [
      {
        question: "Which sentence is correct?",
        options: [
          "He don't like pizza.",
          "He doesn't likes pizza.",
          "He doesn't like pizza.",
          "He not like pizza.",
        ],
        correctIndex: 2,
      },
      {
        question: `Choose the past tense of „to write“.`,
        options: ["writed", "wrote", "written", "writen"],
        correctIndex: 1,
      },
      {
        question: `Which word is a synonym for „happy“?`,
        options: ["sad", "angry", "joyful", "tired"],
        correctIndex: 2,
      },
      {
        question: `What does „to give up“ mean?`,
        options: ["to lift up", "to stop trying", "to help someone", "to arrive"],
        correctIndex: 1,
      },
      {
        question: `Which preposition is correct: „I'm interested ___ art.“`,
        options: ["on", "in", "at", "about"],
        correctIndex: 1,
      },
    ],
  },
  nw: {
    title: "Naturwissenschaften",
    emoji: "🔬",
    tasks: [
      {
        question: "Wie viele Planeten hat unser Sonnensystem (offiziell)?",
        options: ["7", "8", "9", "10"],
        correctIndex: 1,
      },
      {
        question: "Wasser hat die chemische Formel …",
        options: ["H2O", "CO2", "O2", "H2O2"],
        correctIndex: 0,
      },
      {
        question: "Welches Organ pumpt Blut durch den Körper?",
        options: ["Leber", "Lunge", "Herz", "Niere"],
        correctIndex: 2,
      },
      {
        question: "Welche Energieform hat ein Objekt allein durch seine Höhe?",
        options: ["Bewegungsenergie", "Lageenergie", "Wärmeenergie", "elektrische Energie"],
        correctIndex: 1,
      },
      {
        question: "Was ist die Aufgabe der Chloroplasten in Pflanzenzellen?",
        options: [
          "Sie speichern Wasser.",
          "Sie betreiben Photosynthese.",
          "Sie schützen die Zelle.",
          "Sie produzieren Blüten.",
        ],
        correctIndex: 1,
      },
    ],
  },
};

export default function SelfLearnStation({ onComplete, onExit }: StationRenderProps) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const subjectData = subject ? TASKS[subject] : null;
  const idx = answers.length;
  const current = subjectData?.tasks[idx];

  const correctCount = useMemo(() => {
    if (!subjectData) return 0;
    return answers.filter((a, i) => a === subjectData.tasks[i].correctIndex).length;
  }, [answers, subjectData]);

  const chooseSubject = (s: Subject) => {
    setSubject(s);
    setAnswers([]);
    setSelected(null);
    setDone(false);
  };

  const confirm = () => {
    if (selected === null || !subjectData) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setSelected(null);
    if (nextAnswers.length >= subjectData.tasks.length) {
      const c = nextAnswers.filter((a, i) => a === subjectData.tasks[i].correctIndex).length;
      const pct = c / subjectData.tasks.length;
      const score = Math.round(pct * 500);
      setDone(true);
      onComplete({ score, details: { subject, correct: c } });
    }
  };

  const reset = () => {
    setSubject(null);
    setAnswers([]);
    setSelected(null);
    setDone(false);
  };

  return (
    <StationShell
      emoji={STATION.emoji}
      title={STATION.title}
      intro="Wähle ein Fach und beantworte fünf kurze Aufgaben. Jede richtige Antwort bringt Punkte."
      color={STATION.color}
    >
      {!subject && (
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(TASKS) as Subject[]).map((k) => {
            const s = TASKS[k];
            return (
              <button
                key={k}
                onClick={() => chooseSubject(k)}
                className="card p-6 text-left hover:bg-white/[0.06] hover:border-white/20 transition-all"
                type="button"
              >
                <div className="text-4xl">{s.emoji}</div>
                <div className="mt-3 font-display text-xl text-white">{s.title}</div>
                <div className="mt-1 text-sm text-ink-300">
                  {s.tasks.length} Aufgaben · Multiple Choice
                </div>
              </button>
            );
          })}
        </div>
      )}

      {subject && !done && current && subjectData && (
        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between text-sm text-ink-300">
            <span>
              {subjectData.emoji} {subjectData.title} · Aufgabe{" "}
              <b className="text-white">{idx + 1}</b> / {subjectData.tasks.length}
            </span>
            <button onClick={reset} className="btn-ghost px-2 py-1 text-xs">
              ← Fach wechseln
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="mt-4 font-display text-xl sm:text-2xl text-white">
                {current.question}
              </h2>
              <div className="mt-4 grid gap-3">
                {current.options.map((opt, i) => {
                  const isChosen = selected === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelected(i)}
                      className={
                        "text-left rounded-2xl border px-4 py-4 transition-all " +
                        (isChosen
                          ? "border-brand-400 bg-brand-500/15 text-white"
                          : "border-white/10 bg-white/[0.03] text-ink-100 hover:border-white/20 hover:bg-white/[0.06]")
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={confirm}
              disabled={selected === null}
              className="btn-primary px-5 py-3"
            >
              {idx + 1 >= subjectData.tasks.length ? "Auswerten" : "Bestätigen"}
            </button>
          </div>
        </div>
      )}

      {done && subjectData && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 sm:p-10 text-center"
        >
          <div className="text-5xl">{correctCount === subjectData.tasks.length ? "🏆" : "🎓"}</div>
          <h2 className="mt-3 font-display text-3xl text-white">
            {correctCount} von {subjectData.tasks.length} richtig
          </h2>
          <p className="mt-2 text-ink-200">
            {subjectData.emoji} {subjectData.title}
          </p>
          <ul className="mt-6 text-left max-w-xl mx-auto divide-y divide-white/5">
            {subjectData.tasks.map((t, i) => {
              const correct = answers[i] === t.correctIndex;
              return (
                <li key={i} className="py-2 flex items-start gap-3">
                  <span className={correct ? "text-emerald-400" : "text-rose-400"}>
                    {correct ? "✓" : "✕"}
                  </span>
                  <div className="text-sm">
                    <div className="text-white">{t.question}</div>
                    {!correct && (
                      <div className="text-ink-300">
                        Richtig wäre: <b className="text-white">{t.options[t.correctIndex]}</b>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={reset} className="btn-secondary px-5 py-3">
              Anderes Fach
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
