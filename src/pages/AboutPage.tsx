import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const blocks: { title: string; text: string }[] = [
  {
    title: "Was ist GYM GAN?",
    text: `GYM GAN ist eine interaktive Programmier-Rallye, die wir im Projekt „Programmieren“ der Projektwoche selbst entwickelt haben. Sie kombiniert Mini-Spiele, Lernstationen und eine eigene Programm-Bibliothek zu einer kleinen Plattform.`,
  },
  {
    title: "Warum haben wir die Rallye entwickelt?",
    text: "Wir wollten ein Ergebnis, das Besucher:innen ausprobieren können – nicht nur eine Präsentation. Eine Rallye macht es leicht, verschiedene Stationen nacheinander zu erleben, und jede Station zeigt einen anderen Aspekt vom Programmieren.",
  },
  {
    title: "Was haben wir programmiert?",
    text: `Die komplette Web-App inklusive Design, Navigation, aller Stationen und der Programm-Bibliothek mit Scratch-Upload. Zusätzlich unsere eigenen Scratch-Projekte, die ihr im Bereich „Programme“ ausprobieren könnt.`,
  },
  {
    title: "Welche Probleme mussten wir lösen?",
    text: "Wie speichert man Fortschritt ohne Login? Wie zeigt man Scratch-Projekte direkt im Browser? Wie sorgt man dafür, dass alles auch offline auf einem Präsentations-Laptop läuft?",
  },
  {
    title: "Was haben wir gelernt?",
    text: "Vom ersten Wireframe bis zur fertigen App: Konzeption, Aufteilung in Teams, sauberes Design, Umgang mit State und Speichern im Browser – und wie viel Arbeit ein gepflegtes Ergebnis ist.",
  },
];

export function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-display text-4xl sm:text-5xl font-bold text-white"
      >
        Über das Projekt
      </motion.h1>
      <p className="mt-3 text-ink-300">
        Kurz und knapp, worum es bei GYM GAN geht und was wir daraus mitgenommen haben.
      </p>

      <div className="mt-8 space-y-4">
        {blocks.map((b, i) => (
          <motion.article
            key={b.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="card p-6"
          >
            <h2 className="font-display text-xl font-semibold text-white">{b.title}</h2>
            <p className="mt-2 text-ink-200 leading-relaxed">{b.text}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link to="/" className="btn-secondary px-5 py-3">
          {"←"} Zurück zur Startseite
        </Link>
        <Link to="/rallye" className="btn-primary px-5 py-3">
          🎯 Rallye starten
        </Link>
      </div>
    </section>
  );
}
