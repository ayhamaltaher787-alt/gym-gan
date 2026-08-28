import { useState } from "react";
import { motion } from "framer-motion";
import type { ProgramItem } from "../store/programsStore";
import { formatBytes } from "../lib/format";

interface Props {
  program: ProgramItem;
}

/**
 * Available Scratch players. Each entry knows how to build an embed URL and a
 * fullscreen URL for a public .sb3 project URL. If a school firewall blocks
 * one host (very often `turbowarp.org`), the user can switch to another one
 * that runs on a different domain.
 */
interface PlayerDef {
  key: "turbowarp" | "penguinmod";
  label: string;
  hint: string;
  host: string;
  embed: (publicUrl: string) => string;
  fullscreen: (publicUrl: string) => string;
}

const PLAYERS: PlayerDef[] = [
  {
    key: "turbowarp",
    label: "TurboWarp",
    hint: "Standard-Player (turbowarp.org)",
    host: "turbowarp.org",
    embed: (u) => `https://turbowarp.org/embed?project_url=${encodeURIComponent(u)}`,
    fullscreen: (u) => `https://turbowarp.org/fullscreen?project_url=${encodeURIComponent(u)}`,
  },
  {
    key: "penguinmod",
    label: "PenguinMod",
    hint: "Alternative, falls TurboWarp im Netz blockiert ist (studio.penguinmod.com)",
    host: "studio.penguinmod.com",
    embed: (u) =>
      `https://studio.penguinmod.com/PenguinMod.html?project_url=${encodeURIComponent(u)}`,
    fullscreen: (u) =>
      `https://studio.penguinmod.com/PenguinMod.html?project_url=${encodeURIComponent(u)}&fullscreen=true`,
  },
];

const PLAYER_STORAGE_KEY = "gymgan:preferred-player";

function loadPreferredPlayer(): PlayerDef {
  try {
    const saved = localStorage.getItem(PLAYER_STORAGE_KEY);
    const found = PLAYERS.find((p) => p.key === saved);
    if (found) return found;
  } catch {
    // ignore
  }
  return PLAYERS[0];
}

function savePreferredPlayer(p: PlayerDef) {
  try {
    localStorage.setItem(PLAYER_STORAGE_KEY, p.key);
  } catch {
    // ignore
  }
}

/**
 * Runs Scratch (.sb3) programs directly:
 *  - Embeds the file into a live iframe (TurboWarp by default,
 *    PenguinMod as a fallback for restricted networks).
 *  - Fullscreen button opens the project in a new tab with a stable
 *    window name (`gymgan-play-<id>`), so a second click focuses the
 *    already-open tab instead of spawning a duplicate.
 *  - The chosen player is remembered per browser (localStorage).
 */
export function ScratchPreview({ program }: Props) {
  const [player, setPlayer] = useState<PlayerDef>(loadPreferredPlayer);
  const [playing, setPlaying] = useState(false);

  const file = program.file;
  const publicUrl = file?.publicUrl;
  const isScratch = !!publicUrl && /\.sb3$/i.test(file?.name ?? "");

  const switchPlayer = (p: PlayerDef) => {
    setPlayer(p);
    savePreferredPlayer(p);
    // If we're already playing, restart with the new player.
    if (playing) {
      setPlaying(false);
      setTimeout(() => setPlaying(true), 50);
    }
  };

  const openFullscreen = () => {
    if (!publicUrl) return;
    const url = player.fullscreen(publicUrl);
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
              key={player.key}
              title={program.title}
              src={player.embed(publicUrl!)}
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
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-300">
            <span className="hidden sm:inline">Player:</span>
            <div className="inline-flex rounded-lg border border-white/10 overflow-hidden">
              {PLAYERS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => switchPlayer(p)}
                  title={p.hint}
                  className={
                    "px-2.5 py-1 text-xs transition-colors " +
                    (p.key === player.key
                      ? "bg-brand-500/25 text-white"
                      : "text-ink-200 hover:bg-white/5")
                  }
                >
                  {p.label}
                </button>
              ))}
            </div>
            {playing && (
              <span className="hidden md:inline text-[10px] text-ink-400">
                lädt via {player.host}
              </span>
            )}
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
        {playing && (
          <div className="px-4 pb-3 -mt-1 text-[11px] text-ink-400">
            Bleibt der Player leer? Schul-Netzwerk blockiert vielleicht{" "}
            <b className="text-ink-200">{player.host}</b>. Wechsle oben auf einen
            anderen Player oder nutze „⬇ Download" und öffne die Datei später
            außerhalb der Schule.
          </div>
        )}
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
