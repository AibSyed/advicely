import { fallbackCoachingCards } from "@/features/coaching/fallback";
import { coachingPayloadSchema, type CoachingPayload } from "@/features/coaching/schema";

const endpoint = "https://api.adviceslip.com/advice";

function themedCard(theme: CoachingPayload["card"]["theme"], adviceText: string): CoachingPayload {
  return {
    card: {
      id: `${theme}-${Date.now()}`,
      theme,
      headline: `Guidance for ${theme}`,
      prompt: adviceText,
      reflection: "What belief would need to shift for this advice to become actionable?",
      microAction: "Convert this advice into one tiny action and do it within 10 minutes.",
    },
    source: "advice-slip",
    generatedAt: new Date().toISOString(),
  };
}

export async function getCoachingCard(theme: CoachingPayload["card"]["theme"]): Promise<CoachingPayload> {
  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Advice API error");
    }

    const payload = (await response.json()) as { slip?: { advice?: string } };
    const advice = payload.slip?.advice;
    if (!advice) {
      throw new Error("Advice payload missing");
    }

    const card = themedCard(theme, advice);
    const parsed = coachingPayloadSchema.safeParse(card);
    if (!parsed.success) {
      throw new Error("Schema parse failed");
    }

    return parsed.data;
  } catch {
    const fallback = fallbackCoachingCards.find((card) => card.card.theme === theme) ?? fallbackCoachingCards[0];
    return fallback;
  }
}
