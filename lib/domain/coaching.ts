import { coachingResponseSchema, type CoachingResponse, type Theme } from "@/features/coaching/schema";
import { getFallbackPrompt } from "@/features/coaching/fallback";
import { themeBlueprints } from "@/features/coaching/themes";
import { fetchAdviceSlip } from "@/lib/api/providers/advice-slip";
import { fetchQuotable } from "@/lib/api/providers/quotable";
import { isLowQualityAdvice, isUnsafeAdvice } from "@/lib/safety/policy";

function composeCard(theme: Theme, prompt: string, source: "adviceslip" | "quotable" | "fallback", fallbackUsed: boolean): CoachingResponse {
  const blueprint = themeBlueprints[theme];

  return coachingResponseSchema.parse({
    card: {
      id: `${theme}-${Date.now()}`,
      theme,
      headline: blueprint.headline,
      prompt,
      reflection: blueprint.reflection,
      microAction: blueprint.microAction,
      xpReward: blueprint.xpReward,
      confidenceScore: fallbackUsed ? 0.68 : 0.86,
      source,
      fallbackUsed,
      generatedAt: new Date().toISOString(),
    },
    providerHealth: [
      { name: "adviceslip", healthy: source === "adviceslip", message: source === "adviceslip" ? "Primary provider healthy" : "Primary provider unavailable or filtered" },
      { name: "quotable", healthy: source === "quotable", message: source === "quotable" ? "Secondary provider healthy" : "Secondary provider unavailable or filtered" },
      { name: "fallback", healthy: true, message: "Internal fallback always available" },
    ],
    partialData: false,
  });
}

export async function getCoaching(theme: Theme): Promise<CoachingResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    try {
      const prompt = await fetchAdviceSlip(controller.signal);
      if (!isUnsafeAdvice(prompt) && !isLowQualityAdvice(prompt)) {
        return composeCard(theme, prompt, "adviceslip", false);
      }
    } catch {
      // provider fallback
    }

    try {
      const prompt = await fetchQuotable(controller.signal);
      if (!isUnsafeAdvice(prompt) && !isLowQualityAdvice(prompt)) {
        return composeCard(theme, prompt, "quotable", false);
      }
    } catch {
      // provider fallback
    }

    return composeCard(theme, getFallbackPrompt(theme), "fallback", true);
  } finally {
    clearTimeout(timeout);
  }
}
