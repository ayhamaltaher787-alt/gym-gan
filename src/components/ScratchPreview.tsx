import { useState } from "react";
import { motion } from "framer-motion";
import type { ProgramItem } from "../store/programsStore";
import { formatBytes } from "../lib/format";

interface Props {
  program: ProgramItem;
}

/**
 * Build the TurboWarp URL for a given publicly reachable .sb3 file.
 * TurboWarp accepts an external `project_url` query parameter and loads the
 * file directly – no manual upload, no download required.
 */
function turboWarpUrl(publicUrl: string, mode: "editor" | "fullscreen" | "embed" = "fullscreen") {
  const base =
    mode === "editor"
      ? "https://turbowarp.org/editor"
      : mode === "embed"
      ? "https://turbowarp.org/embed"
      : "https://turbowarp.org/fullscreen";
  return `${base}?project_url=${encodeURIComponent(publicUrl)}`;
}

/**
 * Runs Scratch (.sb3) programs directly:
 *  - In-page via a TurboWarp iframe – you can just press ▶ and play.
 *  - "Vollbild öffnen" opens the same project in a new tab using a stable
 *    window name (`gymgan-play-<id>`), so subsequent clicks on the same
 *    program focus the already-open tab instead of spawning duplicates.
 *  - Non-.sb3 uploads (rare) fall back to a download-first flow.
 */
export function ScratchPreview({ program }: Props) {
  const [playing, setPlaying] = useState(false);

  const file = program.file;
  const publicUrl = file?.publicUrl;
  const isScratch = !!publicUrl && /\.sb3$/i.test(file?.name ?? "");

  const openFullscreen = () => {
    if (!publicUrl) return;
    const url = turboWarpUrl(publicUrl, "fullscreen");
    // Stable window name → same program reuses its tab.
    const winName = `gymgan-play-${program.id}`;
    const w = window.open(url, winName);
    if (w && !w.closed) {
      try {
        w.focus();
      } catch {
        // Some browsers block focus() – silent noop.
      }
    }
  };

  const download = () => {
    if (!publicUrl) return;
    const a = document.createElement("a");
    a.href = publicUrl;
    a.download = file?.name || `${program.title}.sb3`;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (isScratch) {
    return (
      <div className="rounded-3xl overflow-hidden border border-white/10 bg-black shadow-card">
        {playing ? (
          <div className="relative aspect-[4/3] bg-black">
            <iframe
              title={program.title}
              src={turboWarpUrl(publicUrl!, "embed")}
              allowFullScreen
              allow="autoplay; fullscreen; gamepad; microphone; camera"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        ) : (
          <div className="relative aspect-[4/3] bg-gradient-to-br from-ink-800 via-ink-800 to-ink-700">
            {program.thumbnail && (
              <img
                src={program.thumbnail}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <motion.button
                type="button"
                onClick={() => setPlaying(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="h-20 w-20 rounded-full bg-white text-ink-900 flex items-center justify-center shadow-2xl"
                aria-label="Programm starten"
              >
                <svg width="28" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6 4l14 8-14 8V4z" />
                </svg>
              </motion.button>
              <div>
                <div className="font-display text-lg text-white drop-shadow">
                  ▶ Direkt spielen
                </div>
                <div className="text-xs text-white/70">
                  Scratch-Projekt · {file ? formatBytes(file.size) : ""}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-ink-900/80 border-t border-white/10">
          <div className="text-xs text-ink-300 truncate">
            {playing ? "Läuft in-app · gehostet über TurboWarp" : "Klick auf ▶ zum direkten Spielen"}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {playing && (
              <button
                type="button"
                onClick={() => setPlaying(false)}
                className="btn-ghost px-3 py-1.5 text-xs"
              >
                ◼ Anhalten
              </button>
            )}
            <button
              type="button"
              onClick={openFullscreen}
              className="btn-secondary px-3 py-1.5 text-xs"
              title="Öffnet in neuem Tab; ist das Programm schon offen, wird der Tab wiederverwendet."
            >
              ⛶ Vollbild
            </button>
            <button
              type="button"
              onClick={download}
              className="btn-ghost px-3 py-1.5 text-xs"
            >
              ⬇ Download
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for uploads without a .sb3 (e.g. .zip / .html / no file at all).
  return (
    <div className="rounded-3xl border border-white/10 bg-ink-800 shadow-card p-8 text-center">
      <div className="text-4xl mb-3">📦</div>
      <div className="font-display text-lg text-white">{program.title}</div>
      <p className="mt-2 text-sm text-ink-300">
        {publicUrl
          ? "Für dieses Programm ist kein direkter Scratch-Player verfügbar."
          : "Für dieses Programm liegt (noch) keine Datei in der Cloud."}
      </p>
      {publicUrl && (
        <button
          type="button"
          onClick={download}
          className="btn-primary mt-5 px-5 py-3"
        >
          ⬇ Datei herunterladen
        </button>
      )}
    </div>
  );
}
