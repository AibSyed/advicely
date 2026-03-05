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
    headline: "Practical Signal",
    microAction: "Commit to one concrete next step you can finish in 10 minutes.",
    reflectionPrompt: "What would make this advice easier to execute today?",
  },
  bold: {
    headline: "Pressure Test",
    microAction: "Do the uncomfortable action first and measure what changes.",
    reflectionPrompt: "Which fear is pretending to be strategy right now?",
  },
  calm: {
    headline: "Steady Reset",
    microAction: "Take one slow breath, then move with deliberate pacing.",
    reflectionPrompt: "What outcome matters if you remove urgency from this moment?",
  },
  playful: {
    headline: "Momentum Spark",
    microAction: "Gamify the next move and reward yourself for launching quickly.",
    reflectionPrompt: "How can you make this step feel lighter without lowering quality?",
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
      advice: `${cleaned} Treat it like a small quest.`,
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
