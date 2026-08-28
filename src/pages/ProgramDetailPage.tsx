import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgramsStore } from "../store/programsStore";
import { ScratchPreview } from "../components/ScratchPreview";
import { DeleteWithCodeModal } from "../components/DeleteWithCodeModal";
import { formatBytes, formatDate } from "../lib/format";

const CATEGORY_LABEL: Record<string, string> = {
  spiel: "Spiel",
  lernen: "Lernen",
  ki: "KI",
  sonstiges: "Sonstiges",
};

export function ProgramDetailPage() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const program = useProgramsStore((s) =>
    s.programs.find((p) => p.id === programId)
  );
  const loadedOnce = useProgramsStore((s) => s.loadedOnce);
  const loading = useProgramsStore((s) => s.loading);
  const removeProgram = useProgramsStore((s) => s.removeProgram);
  const refresh = useProgramsStore((s) => s.refresh);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!loadedOnce && !loading) refresh();
  }, [loadedOnce, loading, refresh]);

  if (loading && !program) {
    return (
      <section className="max-w-lg mx-auto px-4 py-20 text-center text-ink-300">
        Programm wird geladen…
      </section>
    );
  }

  if (!program) {
    return (
      <section className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl">🔎</div>
        <h1 className="mt-3 font-display text-2xl text-white">Programm nicht gefunden</h1>
        <p className="mt-1 text-ink-300">Es wurde vielleicht entfernt.</p>
        <Link to="/programme" className="btn-primary mt-6 px-5 py-3 inline-flex">
          ← Zur Bibliothek
        </Link>
      </section>
    );
  }

  const confirmedDelete = async () => {
    await removeProgram(program.id);
    navigate("/programme");
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/programme" className="btn-ghost px-3 py-2 text-sm">
          ← Zurück zu Programme
        </Link>
        <button
          onClick={() => setDeleteOpen(true)}
          className="btn-ghost px-3 py-2 text-sm text-rose-300 hover:text-rose-200"
        >
          🗑️ Entfernen
        </button>
      </div>

      <DeleteWithCodeModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        itemName={program.title}
        onConfirmed={confirmedDelete}
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ScratchPreview program={program} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="card p-6 sm:p-8"
        >
          <div className="chip mb-3">
            {program.type === "scratch" ? "🧱 Scratch-Projekt" : "🧩 Programm"}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
            {program.title}
          </h1>
          <p className="mt-1 text-ink-300">
            von <b className="text-white">{program.author}</b> ·{" "}
            {formatDate(program.createdAt)}
          </p>
          <p className="mt-5 text-ink-100 leading-relaxed">{program.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink-300">Kategorie</dt>
              <dd className="text-white font-medium">{CATEGORY_LABEL[program.category]}</dd>
            </div>
            <div>
              <dt className="text-ink-300">Typ</dt>
              <dd className="text-white font-medium capitalize">{program.type}</dd>
            </div>
            {program.file && (
              <>
                <div>
                  <dt className="text-ink-300">Datei</dt>
                  <dd className="text-white font-medium truncate">{program.file.name}</dd>
                </div>
                <div>
                  <dt className="text-ink-300">Größe</dt>
                  <dd className="text-white font-medium">
                    {formatBytes(program.file.size)}
                  </dd>
                </div>
              </>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/programme" className="btn-secondary px-4 py-2 text-sm">
              ← Programme
            </Link>
            <Link to="/programme/neu" className="btn-ghost px-4 py-2 text-sm">
              + Weiteres Programm
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
