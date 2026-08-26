export const STORAGE_KEYS = {
  rallye: "gymgan:rallye:v1",
  programs: "gymgan:programs:v1",
  rating: "gymgan:rating:v1",
} as const;

export function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded – ignore silently for demo scenarios.
  }
}
