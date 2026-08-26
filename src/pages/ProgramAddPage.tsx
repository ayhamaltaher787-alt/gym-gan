import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgramsStore, type ProgramCategory, type ProgramType } from "../store/programsStore";
import { SUPABASE_CONFIGURED } from "../lib/supabase";
import { formatBytes } from "../lib/format";

const CATEGORIES: { key: ProgramCategory; label: string; emoji: string }[] = [
  { key: "spiel", label: "Spiel", emoji: "🎮" },
  { key: "lernen", label: "Lernen", emoji: "🧠" },
  { key: "ki", label: "KI", emoji: "🤖" },
  { key: "sonstiges", label: "Sonstiges", emoji: "🧩" },
];

const MAX_UPLOAD_MB = 50;

export function ProgramAddPage() {
  const navigate = useNavigate();
  const addProgram = useProgramsStore((s) => s.addProgram);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<ProgramCategory>("spiel");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const type: ProgramType = useMemo(() => {
    if (!file) return "scratch";
    if (file.name.toLowerCase().endsWith(".sb3")) return "scratch";
    if (/\.(html|htm)$/i.test(file.name)) return "web";
    return "other";
  }, [file]);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (!/\.(sb3|sb2|html|zip)$/i.test(f.name)) {
      setError("Bitte eine .sb3-Datei (Scratch) auswählen. (.html/.zip sind optional erlaubt.)");
    }
    setFile(f);
  };

  const onThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) {
      setError("Vorschaubild muss eine Bilddatei sein.");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setError("Vorschaubild ist zu groß (max. 2 MB).");
      return;
    }
    setThumbnail(f);
    setThumbnailPreview(URL.createObjectURL(f));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!SUPABASE_CONFIGURED) {
      setError(
        "Supabase ist noch nicht verbunden – siehe README. Uploads werden erst möglich, wenn die Umgebungsvariablen gesetzt sind."
      );
      return;
    }
    if (!title.trim()) return setError("Bitte einen Programmnamen eingeben.");
    if (!author.trim()) return setError("Bitte Autor / Gruppe eingeben.");

    if (file) {
      const mb = file.size / (1024 * 1024);
      if (mb > MAX_UPLOAD_MB) {
        setError(
          `Die Datei ist ${mb.toFixed(1)} MB groß. Maximal erlaubt sind ${MAX_UPLOAD_MB} MB.`
        );
        return;
      }
    }

    setBusy(true);
    try {
      const created = await addProgram({
        title: title.trim(),
        description: description.trim() || "Keine Beschreibung angegeben.",
        author: author.trim(),
        category,
        type,
        file,
        thumbnail,
      });
      navigate(`/programme/${created.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler beim Hochladen.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/programme" className="btn-ghost px-3 py-2 text-sm">
          ← Programme
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card p-6 sm:p-8"
      >
        <h1 className="font-display text-3xl font-bold text-white">Neues Programm hinzufügen</h1>
        <p className="mt-1 text-ink-300">
          Trage deine Projekt-Infos ein und lade optional eine Scratch-Datei (.sb3) hoch. Die Datei
          landet in unserer Cloud (Supabase) und ist danach für alle Besucher:innen sichtbar.
        </p>

        {!SUPABASE_CONFIGURED && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Supabase ist noch nicht verbunden. Uploads funktionieren erst nach dem Setzen der
            Umgebungsvariablen (siehe README).
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="title" className="label">
              Programmname *
            </label>
            <input
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Snake Deluxe"
            />
          </div>
          <div>
            <label htmlFor="desc" className="label">
              Beschreibung
            </label>
            <textarea
              id="desc"
              className="input resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurzer Text – worum geht's, was ist besonders?"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="author" className="label">
                Autor / Gruppe *
              </label>
              <input
                id="author"
                className="input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Gruppe 3"
              />
            </div>
            <div>
              <div className="label">Kategorie</div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key)}
                    className={
                      "rounded-xl px-3 py-2 text-sm border transition-all " +
                      (category === c.key
                        ? "bg-brand-500/20 border-brand-400 text-white"
                        : "bg-white/[0.03] border-white/10 text-ink-100 hover:bg-white/10")
                    }
                  >
                    <span aria-hidden className="mr-1.5">
                      {c.emoji}
                    </span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="label">Scratch-Datei (.sb3)</div>
            <div
              className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 flex flex-col items-center gap-3 text-center cursor-pointer hover:bg-white/[0.04]"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
              }}
            >
              <div className="text-3xl">📦</div>
              {file ? (
                <div>
                  <div className="text-white font-medium">{file.name}</div>
                  <div className="text-xs text-ink-300">{formatBytes(file.size)}</div>
                </div>
              ) : (
                <div>
                  <div className="text-white font-medium">Datei auswählen</div>
                  <div className="text-xs text-ink-300">.sb3 empfohlen · max. {MAX_UPLOAD_MB} MB</div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".sb3,.sb2,.html,.zip"
                onChange={onFile}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="thumb" className="label">
              Vorschaubild (optional)
            </label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-24 rounded-lg overflow-hidden bg-white/[0.06] border border-white/10 flex items-center justify-center">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-ink-400 text-xs">Kein Bild</span>
                )}
              </div>
              <input
                id="thumb"
                type="file"
                accept="image/*"
                onChange={onThumbnail}
                className="text-sm file:mr-3 file:btn-secondary file:px-3 file:py-1.5 file:text-sm file:border-0"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/programme" className="btn-ghost px-4 py-2">
              Abbrechen
            </Link>
            <button type="submit" disabled={busy} className="btn-primary px-6 py-3">
              {busy ? "Lade hoch…" : "Programm hinzufügen"}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
