import { create } from "zustand";
import type { StationId } from "../data/stationsConfig";
import { STATIONS } from "../data/stationsConfig";
import { STORAGE_KEYS, safeGet, safeSet } from "../lib/storage";

export type StationStatus = "idle" | "in_progress" | "completed";

export interface StationProgress {
  status: StationStatus;
  score: number;
  bestScore: number;
  attempts: number;
  lastPlayedAt?: string;
}

export interface RallyeState {
  progress: Record<StationId, StationProgress>;
  markInProgress: (id: StationId) => void;
  completeStation: (id: StationId, score: number) => void;
  resetStation: (id: StationId) => void;
  resetAll: () => void;
}

const emptyProgress = (): StationProgress => ({
  status: "idle",
  score: 0,
  bestScore: 0,
  attempts: 0,
});

const buildInitial = (): Record<StationId, StationProgress> => {
  const map = {} as Record<StationId, StationProgress>;
  for (const s of STATIONS) map[s.id] = emptyProgress();
  return map;
};

const persisted = safeGet<Record<StationId, StationProgress>>(
  STORAGE_KEYS.rallye,
  buildInitial()
);
// Ensure all stations exist even if config changed after previous save.
const initial = { ...buildInitial(), ...persisted };

function persist(state: Record<StationId, StationProgress>) {
  safeSet(STORAGE_KEYS.rallye, state);
}

export const useRallyeStore = create<RallyeState>((set, get) => ({
  progress: initial,
  markInProgress: (id) => {
    const cur = get().progress[id];
    if (cur.status === "completed") return; // don't downgrade
    const next = { ...get().progress, [id]: { ...cur, status: "in_progress" as StationStatus } };
    persist(next);
    set({ progress: next });
  },
  completeStation: (id, score) => {
    const cur = get().progress[id];
    const bestScore = Math.max(cur.bestScore, score);
    const updated: StationProgress = {
      status: "completed",
      score,
      bestScore,
      attempts: cur.attempts + 1,
      lastPlayedAt: new Date().toISOString(),
    };
    const next = { ...get().progress, [id]: updated };
    persist(next);
    set({ progress: next });
  },
  resetStation: (id) => {
    const next = { ...get().progress, [id]: emptyProgress() };
    persist(next);
    set({ progress: next });
  },
  resetAll: () => {
    const next = buildInitial();
    persist(next);
    set({ progress: next });
  },
}));

export function useRallyeStats() {
  const progress = useRallyeStore((s) => s.progress);
  const stations = STATIONS;
  const completed = stations.filter((s) => progress[s.id].status === "completed").length;
  const total = stations.length;
  const totalScore = stations.reduce((sum, s) => sum + progress[s.id].bestScore, 0);
  const totalMax = stations.reduce((sum, s) => sum + s.maxPoints, 0);
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const isFinished = completed === total;
  return { completed, total, totalScore, totalMax, percent, isFinished };
}
