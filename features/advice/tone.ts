import type { ToneProfile } from "@/features/advice/contracts";
import { normalizeAdviceText } from "@/features/advice/quality";

export interface TonedAdvice {
  headline: string;
  advice: string;
  microAction: string;
  reflectionPrompt: string;
}

const toneBlueprint: Record<ToneProfile, { headline: string; microAction: string; reflectionPrompt: string }> = {
  grounded: {
    headline: "Practical Next Step",
    microAction: "Choose one step you can finish in the next 10 minutes.",
    reflectionPrompt: "What might block this, and how can you make it easier?",
  },
  bold: {
    headline: "Clear Push Forward",
    microAction: "Do the hardest useful step first, even if it feels uncomfortable.",
    reflectionPrompt: "If you stopped overthinking, what would you do next?",
  },
  calm: {
    headline: "Steady Advice",
    microAction: "Take one slow breath, then take a small step at a steady pace.",
    reflectionPrompt: "What would this look like at a pace you can sustain?",
  },
  playful: {
    headline: "Fresh Perspective",
    microAction: "Make the next step tiny and enjoyable so you actually begin.",
    reflectionPrompt: "How can you make this easier to start right now?",
  },
};

export function applyToneProfile(baseAdvice: string, toneProfile: ToneProfile): TonedAdvice {
  const cleaned = normalizeAdviceText(baseAdvice);
  const blueprint = toneBlueprint[toneProfile];

  if (toneProfile === "bold") {
    const emphatic = cleaned.endsWith("!") ? cleaned : `${cleaned.replace(/[.]$/, "")}!`;
    return {
      headline: blueprint.headline,
      advice: emphatic,
      microAction: blueprint.microAction,
      reflectionPrompt: blueprint.reflectionPrompt,
    };
  }

  if (toneProfile === "calm") {
    return {
      headline: blueprint.headline,
      advice: cleaned.replace(/!/g, "."),
      microAction: blueprint.microAction,
      reflectionPrompt: blueprint.reflectionPrompt,
    };
  }

  if (toneProfile === "playful") {
    return {
      headline: blueprint.headline,
      advice: `${cleaned} Keep it light and start small.`,
      microAction: blueprint.microAction,
      reflectionPrompt: blueprint.reflectionPrompt,
    };
  }

  return {
    headline: blueprint.headline,
    advice: cleaned,
    microAction: blueprint.microAction,
    reflectionPrompt: blueprint.reflectionPrompt,
  };
}
