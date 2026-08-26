import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "./Modal";
import type { ProgramItem } from "../store/programsStore";
import { formatBytes } from "../lib/format";

interface Props {
  program: ProgramItem;
}

/**
 * A safe, offline-friendly preview / launcher for uploaded Scratch projects.
 *
 * Directly running arbitrary .sb3 files inside our own React bundle would require
 * shipping the full Scratch VM (Node-oriented, large, unstable in Vite without
 * heavy shimming). Instead we:
 *
 *  1. Show a rich preview card with metadata + a big "▶" call to action.
 *  2. Offer "Datei herunterladen" (always works, even offline).
 *  3. Offer "In TurboWarp öffnen" – opens turbowarp.org in a new tab, where the
 *     user can drop the downloaded .sb3 to play it. TurboWarp is a well-known,
 *     browser-based Scratch player; if you're online during the presentation
 *     it's a one-click flow.
 */
export function ScratchPreview({ program }: Props) {
  const [modal, setModal] = useState(false);

  const download = () => {
    if (!program.file?.publicUrl) return;
    const a = document.createElement("a");
    a.href = program.file.publicUrl;
    a.download = program.file.name || `${program.title}.sb3`;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const canPlay = !!program.file?.publicUrl && /\.sb3$/i.test(program.file?.name ?? "");

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-ink-800 via-ink-800 to-ink-700 shadow-card">
        {program.thumbnail ? (
          <img
            src={program.thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(58,94,255,0.35),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(255,154,26,0.25),transparent_60%)]" />
        )}
        <div className="relative aspect-video flex flex-col items-center justify-center gap-4 p-6">
          <motion.button
            type="button"
            onClick={() => setModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="h-20 w-20 rounded-full bg-white text-ink-900 flex items-center justify-center shadow-2xl"
            aria-label="Programm starten"
          >
            <svg width="28" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6 4l14 8-14 8V4z" />
            </svg>
          </motion.button>
          <div className="text-center">
            <div className="font-display text-lg text-white drop-shadow">
              {program.title}
            </div>
            <div className="text-xs text-white/70">
              {program.type === "scratch" ? "Scratch-Projekt" : "Programm"}
              {program.file && ` · ${formatBytes(program.file.size)}`}
            </div>
          </div>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} labelledBy="play-title">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-ink-300">
                Programm starten
              </div>
              <h2 id="play-title" className="font-display text-2xl text-white mt-0.5">
                {program.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setModal(false)}
              className="btn-ghost px-2 py-1"
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 text-ink-200 text-sm">
            {canPlay ? (
              <>
                <p>
                  Dein Scratch-Projekt liegt fertig im Browser bereit. Für die volle Wiedergabe
                  nutzt du am besten einen Scratch-Player wie <b>TurboWarp</b> – dort läuft die
                  Datei direkt und ohne Installation.
                </p>
                <ol className="mt-3 list-decimal pl-5 space-y-1 text-ink-100">
                  <li>Klicke auf „Datei herunterladen".</li>
                  <li>Klicke auf „In TurboWarp öffnen".</li>
                  <li>Ziehe die heruntergeladene Datei in TurboWarp – und los!</li>
                </ol>
              </>
            ) : (
              <p>
                Für dieses Programm ist keine hochgeladene Datei vorhanden. Frage die
                Programm-Autor:innen nach dem aktuellen Stand oder lade eine .sb3-Version über
                „+ Programm hinzufügen" hoch.
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={download}
              disabled={!canPlay}
              className="btn-secondary px-5 py-3"
            >
              ⬇️ Datei herunterladen
            </button>
            <a
              href="https://turbowarp.org/editor"
              target="_blank"
              rel="noreferrer noopener"
              className="btn-primary px-5 py-3"
            >
              ▶ In TurboWarp öffnen
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
