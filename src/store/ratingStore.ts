import { create } from "zustand";
import { STORAGE_KEYS, safeGet, safeSet } from "../lib/storage";

export interface RatingEntry {
  stars: number; // 1-5
  liked: string[]; // list of highlight options selected
  improvement: string;
  submittedAt: string;
}

interface RatingState {
  ratings: RatingEntry[];
  submit: (r: Omit<RatingEntry, "submittedAt">) => void;
  clear: () => void;
}

const persisted = safeGet<RatingEntry[]>(STORAGE_KEYS.rating, []);

function persist(list: RatingEntry[]) {
  safeSet(STORAGE_KEYS.rating, list);
}

export const useRatingStore = create<RatingState>((set, get) => ({
  ratings: persisted,
  submit: (r) => {
    const entry: RatingEntry = { ...r, submittedAt: new Date().toISOString() };
    const next = [entry, ...get().ratings];
    persist(next);
    set({ ratings: next });
  },
  clear: () => {
    persist([]);
    set({ ratings: [] });
  },
}));
