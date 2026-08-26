import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🧭</div>
      <h1 className="font-display text-3xl font-bold text-white">Seite nicht gefunden</h1>
      <p className="mt-2 text-ink-300">Diese Route gibt es in GYM GAN nicht.</p>
      <Link to="/" className="btn-primary mt-6 px-5 py-3 inline-flex">
        Zur Startseite
      </Link>
    </section>
  );
}
