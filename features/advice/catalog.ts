import type { AdviceIntent } from "@/features/advice/contracts";

export interface FallbackAdviceSeed {
  advice: string;
  intents: AdviceIntent[];
}

export const fallbackAdviceCatalog: FallbackAdviceSeed[] = [
  {
    advice:
      "Shrink the problem to one action you can finish in ten minutes, then evaluate before adding more.",
    intents: ["quick", "planning", "general"],
  },
  {
    advice:
      "If two options look similar, pick the one that is easiest to reverse and learn from quickly.",
    intents: ["decision", "general"],
  },
  {
    advice:
      "Say what you need in one clear sentence, then add one supporting reason without overexplaining.",
    intents: ["communication"],
  },
  {
    advice:
      "When stress spikes, pause long enough to lower your heart rate before deciding or replying.",
    intents: ["stress", "decision", "communication"],
  },
  {
    advice:
      "Before starting, write what done means in plain language so you can stop at the right time.",
    intents: ["planning", "general"],
  },
  {
    advice:
      "When overwhelmed, choose one constraint to optimize for today: time, quality, or energy.",
    intents: ["stress", "decision", "planning"],
  },
  {
    advice:
      "If a decision feels fuzzy, ask for one additional fact that would actually change your choice.",
    intents: ["decision", "communication"],
  },
  {
    advice:
      "Use your first productive hour for your highest-impact task before checking low-priority requests.",
    intents: ["quick", "planning", "general"],
  },
  {
    advice:
      "For difficult conversations, prepare two lines: your request and your boundary if the request is ignored.",
    intents: ["communication", "decision"],
  },
  {
    advice:
      "When uncertain, run the smallest safe experiment instead of committing to a full irreversible move.",
    intents: ["decision", "planning", "general"],
  },
];
