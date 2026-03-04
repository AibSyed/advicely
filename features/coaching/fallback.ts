import type { CoachingPayload } from "./schema";

export const fallbackCoachingCards: CoachingPayload[] = [
  {
    card: {
      id: "focus-01",
      theme: "focus",
      headline: "Protect your deep-work window",
      prompt: "What one task would make today feel complete if finished before noon?",
      reflection: "Notice how distractions show up right before meaningful progress.",
      microAction: "Silence notifications for 45 minutes and complete one high-value block."
    },
    source: "curated",
    generatedAt: "2026-03-01T00:00:00Z"
  },
  {
    card: {
      id: "confidence-01",
      theme: "confidence",
      headline: "Borrow confidence from evidence",
      prompt: "What difficult thing did you handle this quarter that your past self could not?",
      reflection: "Confidence compounds when you log evidence, not vibes.",
      microAction: "Write 3 proof points of competence in your notes right now."
    },
    source: "curated",
    generatedAt: "2026-03-01T00:00:00Z"
  }
];
