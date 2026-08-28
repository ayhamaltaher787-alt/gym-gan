import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";

const DELETE_CODE = "1989";

interface Props {
  open: boolean;
  onClose: () => void;
  itemName: string;
  onConfirmed: () => Promise<void>;
}

/**
 * Prompt users for a numeric code before performing a destructive action.
 * Prevents accidental / random deletions from public visitors during the
 * presentation. Code is intentionally simple – it's an "are you allowed" gate,
 * not real security.
 */
export function DeleteWithCodeModal({ open, onClose, itemName, onConfirmed }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCode("");
      setError(null);
      setBusy(false);
      // Focus after modal mount animation.
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (code.trim() !== DELETE_CODE) {
      setError("Falscher Code. Bitte frag deine Betreuung.");
      setCode("");
      inputRef.current?.focus();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onConfirmed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen.");
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} labelledBy="delete-title">
      <form onSubmit={submit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-rose-300">
              Programm entfernen
            </div>
            <h2 id="delete-title" className="font-display text-2xl text-white mt-0.5">
              Wirklich „{itemName}" löschen?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="btn-ghost px-2 py-1"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 text-sm text-ink-200">
          Das entfernt das Programm und die Datei aus der Cloud – für alle. Zur Bestätigung
          brauchst du den Löschcode (bekommst du von deiner Betreuung).
        </p>

        <div className="mt-5">
          <label htmlFor="delete-code" className="label">
            Löschcode
          </label>
          <input
            id="delete-code"
            ref={inputRef}
            type="password"
            inputMode="numeric"
            autoComplete="off"
            className="input tracking-widest text-lg"
            placeholder="••••"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            disabled={busy}
            maxLength={12}
          />
          {error && (
            <div className="mt-2 text-sm text-rose-300">{error}</div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="btn-ghost px-4 py-2"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={busy || code.length === 0}
            className="btn px-5 py-3 bg-gradient-to-br from-rose-500 to-rose-700 text-white hover:from-rose-400 hover:to-rose-600 active:scale-[0.98]"
          >
            {busy ? "Lösche…" : "🗑️ Endgültig löschen"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
