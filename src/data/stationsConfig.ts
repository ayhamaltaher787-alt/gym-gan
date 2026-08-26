import type { LazyExoticComponent, ComponentType } from "react";
import { lazy } from "react";

export type StationId =
  | "spiel"
  | "lernen"
  | "selbstlernen"
  | "logik"
  | "ki";

export type StationCategory = "spiel" | "lernen" | "logik" | "ki";

export interface StationDefinition {
  id: StationId;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  category: StationCategory;
  color: string; // tailwind gradient stops fragment
  maxPoints: number;
  estimatedMinutes: number;
  component: LazyExoticComponent<ComponentType<StationRenderProps>>;
}

export interface StationRenderProps {
  onComplete: (result: { score: number; details?: Record<string, unknown> }) => void;
  onExit: () => void;
  previousScore?: number;
}

export const STATIONS: StationDefinition[] = [
  {
    id: "spiel",
    title: "Reaktionsspiel",
    emoji: "🎮",
    tagline: "Wie schnell reagierst du?",
    description:
      "Klicke, sobald die Fläche grün wird. Mehrere Runden, deine Zeit entscheidet über die Punktzahl.",
    category: "spiel",
    color: "from-fuchsia-500 via-brand-500 to-brand-700",
    maxPoints: 1000,
    estimatedMinutes: 2,
    component: lazy(() => import("../stations/ReactionStation")),
  },
  {
    id: "lernen",
    title: "Lernmethoden",
    emoji: "🧠",
    tagline: "Welche Lernmethode passt zu dir?",
    description:
      "Kurzes Quiz mit ehrlichen Antworten – am Ende schlagen wir dir eine Methode vor, die zu deinem Lernstil passt.",
    category: "lernen",
    color: "from-emerald-400 via-teal-500 to-brand-600",
    maxPoints: 100,
    estimatedMinutes: 3,
    component: lazy(() => import("../stations/LearningStation")),
  },
  {
    id: "selbstlernen",
    title: "Selbstlernzentrum",
    emoji: "💻",
    tagline: "Wähle dein Fach – löse Aufgaben",
    description:
      "Aussuchen: Mathe, Deutsch, Englisch oder Naturwissenschaften. Fünf Aufgaben, direktes Feedback.",
    category: "lernen",
    color: "from-sky-400 via-brand-500 to-indigo-700",
    maxPoints: 500,
    estimatedMinutes: 4,
    component: lazy(() => import("../stations/SelfLearnStation")),
  },
  {
    id: "logik",
    title: "Logik-Challenge",
    emoji: "🧩",
    tagline: "Denk wie ein:e Programmierer:in",
    description:
      "Code-Reihenfolgen, Mustererkennung, kleine Rätsel – knacke alle Aufgaben und sammle Punkte.",
    category: "logik",
    color: "from-amber-400 via-orange-500 to-rose-600",
    maxPoints: 500,
    estimatedMinutes: 4,
    component: lazy(() => import("../stations/LogicStation")),
  },
  {
    id: "ki",
    title: "KI-Challenge",
    emoji: "🤖",
    tagline: "Mensch oder KI?",
    description:
      "Fünf kurze Texte – rate, ob sie ein Mensch geschrieben hat oder eine KI. Am Ende: die Auflösung.",
    category: "ki",
    color: "from-purple-500 via-fuchsia-500 to-rose-500",
    maxPoints: 500,
    estimatedMinutes: 4,
    component: lazy(() => import("../stations/AIStation")),
  },
];

export function stationById(id: string | undefined): StationDefinition | undefined {
  if (!id) return undefined;
  return STATIONS.find((s) => s.id === id);
}
