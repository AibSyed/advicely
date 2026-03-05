import type { ToneProfile } from "@/features/advice/contracts";

export interface FallbackAdviceSeed {
  headline: string;
  advice: string;
  microAction: string;
  reflectionPrompt: string;
  toneProfile: ToneProfile;
}

export const fallbackAdviceCatalog: FallbackAdviceSeed[] = [
  {
    headline: "Reduce Noise",
    advice: "Pick one meaningful task and hide everything else until it is complete.",
    microAction: "Set a 12 minute focus timer and close every unrelated tab.",
    reflectionPrompt: "What distraction keeps pretending to be urgent?",
    toneProfile: "grounded",
  },
  {
    headline: "Stop Negotiating",
    advice: "Choose the hard right move now before your comfort starts bargaining.",
    microAction: "Write the one uncomfortable action and do it before your next break.",
    reflectionPrompt: "What excuse appears first when progress gets real?",
    toneProfile: "bold",
  },
  {
    headline: "Lower the Pulse",
    advice: "Slow your breath first, then make the decision from a calmer nervous system.",
    microAction: "Take six slow breaths with a longer exhale before your next reply.",
    reflectionPrompt: "How does this problem look after your body settles?",
    toneProfile: "calm",
  },
  {
    headline: "Make It Playable",
    advice: "Turn the task into a mini challenge and score yourself only on starting.",
    microAction: "Give yourself two minutes to produce the worst first draft on purpose.",
    reflectionPrompt: "What tiny version of success would feel fun today?",
    toneProfile: "playful",
  },
  {
    headline: "Small Wins Compound",
    advice: "Consistency beats intensity when you are building a durable routine.",
    microAction: "Repeat yesterday's easiest productive step before trying anything bigger.",
    reflectionPrompt: "Which tiny win can you repeat tomorrow with zero friction?",
    toneProfile: "grounded",
  },
  {
    headline: "Decide and Ship",
    advice: "Your momentum grows when you publish imperfect work instead of polishing forever.",
    microAction: "Ship a version that is 80 percent done and collect one piece of feedback.",
    reflectionPrompt: "Where are you hiding behind perfection?",
    toneProfile: "bold",
  },
  {
    headline: "Steady Over Fast",
    advice: "Aim for a pace you can sustain this week, not a sprint you regret tomorrow.",
    microAction: "Cut today's plan to three steps and complete them in order.",
    reflectionPrompt: "What pace would future-you thank you for?",
    toneProfile: "calm",
  },
  {
    headline: "Reward the Attempt",
    advice: "Celebrate effort while the outcome is still uncertain to keep your brain engaged.",
    microAction: "After your next attempt, mark it as a win before judging quality.",
    reflectionPrompt: "What changes when effort itself becomes a reward?",
    toneProfile: "playful",
  },
];
