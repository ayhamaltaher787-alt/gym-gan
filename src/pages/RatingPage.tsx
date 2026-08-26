import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "../components/StarRating";
import { useRatingStore } from "../store/ratingStore";

const HIGHLIGHTS = [
  "🎮 Die Spiele",
  "🧠 Die Lernstationen",
  "🎨 Das Design",
  "💻 Die Programm-Bibliothek",
  "⚡ Wie schnell alles reagiert",
  "🎯 Der Aufbau als Rallye",
];

export function RatingPage() {
  const [stars, setStars] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [improvement, setImprovement] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = useRatingStore((s) => s.submit);

  const toggleLike = (label: string) => {
    setLiked((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const doSubmit = () => {
    submit({ stars, liked, improvement: improvement.trim() });
    setSubmitted(true);
  };

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="card p-6 sm:p-8"
          >
            <div className="text-center">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Deine Bewertung
              </h1>
              <p className="mt-2 text-ink-300">
                Nur wenige Klicks – hilft uns extrem bei der nächsten Version.
              </p>
            </div>

            <div className="mt-8">
              <label className="label text-center block">Wie hat dir GYM GAN gefallen?</label>
              <div className="mt-2 flex justify-center">
                <StarRating value={stars} onChange={setStars} />
              </div>
            </div>

            <div className="mt-8">
              <div className="label">Was hat dir am besten gefallen?</div>
              <div className="flex flex-wrap gap-2">
                {HIGHLIGHTS.map((h) => {
                  const active = liked.includes(h);
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => toggleLike(h)}
                      className={
                        "rounded-full px-3 py-1.5 text-sm border transition-all " +
                        (active
                          ? "bg-brand-500/20 border-brand-400 text-white"
                          : "bg-white/[0.03] border-white/10 text-ink-100 hover:bg-white/10")
                      }
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="improve" className="label">
                Was können wir verbessern? (optional)
              </label>
              <textarea
                id="improve"
                rows={4}
                value={improvement}
                onChange={(e) => setImprovement(e.target.value)}
                placeholder="Deine Ideen und Wünsche…"
                className="input resize-none"
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Link to="/rallye/abschluss" className="btn-ghost px-4 py-2 text-sm">
                ← Zurück zum Ergebnis
              </Link>
              <button
                onClick={doSubmit}
                disabled={stars === 0}
                className="btn-primary px-6 py-3"
              >
                Bewertung absenden
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 sm:p-10 text-center"
          >
            <div className="text-6xl">🙌</div>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
              Vielen Dank für dein Feedback!
            </h1>
            <p className="mt-2 text-ink-300">
              Deine Bewertung ist gespeichert – jetzt kannst du die Rallye weiter erkunden.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Link to="/rallye" className="btn-secondary px-4 py-3">
                🗺️ Zur Rallye
              </Link>
              <Link to="/rallye/abschluss" className="btn-secondary px-4 py-3">
                🔄 Station erneut starten
              </Link>
              <Link to="/" className="btn-primary px-4 py-3">
                🏠 Hauptmenü
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
