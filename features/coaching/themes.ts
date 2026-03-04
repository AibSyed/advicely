import type { Theme } from "@/features/coaching/schema";

export type ThemeBlueprint = {
  headline: string;
  reflection: string;
  microAction: string;
  xpReward: number;
  intensity: "steady" | "high";
};

export const themeBlueprints: Record<Theme, ThemeBlueprint> = {
  focus: {
    headline: "Lock In and Execute",
    reflection: "What distraction pattern keeps stealing your best 30 minutes?",
    microAction: "Run a 12-minute distraction-free sprint now and log the outcome.",
    xpReward: 15,
    intensity: "steady",
  },
  confidence: {
    headline: "Evidence Over Doubt",
    reflection: "What proof from the last 7 days contradicts your self-doubt story?",
    microAction: "Send one decisive message you have been delaying.",
    xpReward: 18,
    intensity: "steady",
  },
  resilience: {
    headline: "Convert Friction to Capacity",
    reflection: "Which current challenge is secretly building your next-level skill?",
    microAction: "Write one sentence reframing today’s hardest moment as training.",
    xpReward: 20,
    intensity: "high",
  },
  clarity: {
    headline: "Sharpen the Objective",
    reflection: "If this goal were measurable by tonight, what would success look like?",
    microAction: "Rewrite your objective into one measurable sentence and share it.",
    xpReward: 16,
    intensity: "steady",
  },
};

export const starterLibrary: Array<{
  id: string;
  theme: Theme;
  title: string;
  description: string;
}> = [
  {
    id: "pre-call-focus",
    theme: "focus",
    title: "Pre-Call Focus Reset",
    description: "A 3-minute ritual to reduce cognitive clutter before high-stakes meetings.",
  },
  {
    id: "confidence-evidence",
    theme: "confidence",
    title: "Confidence Evidence Loop",
    description: "Convert recent wins into explicit proof statements before making decisions.",
  },
  {
    id: "resilience-reframe",
    theme: "resilience",
    title: "Friction Reframe Sprint",
    description: "Use stress points as intentional reps that build execution resilience.",
  },
  {
    id: "clarity-one-metric",
    theme: "clarity",
    title: "One-Metric Objective",
    description: "Define a single measurable success metric for the next 24 hours.",
  },
];
