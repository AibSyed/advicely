import { z } from "zod";
import { AdviceProviderError, mapStatusToErrorState } from "@/lib/api/provider-error";
import type { ProviderCandidate } from "@/lib/api/types";

const zenQuoteSchema = z
  .array(
    z.object({
      q: z.string().min(1),
      a: z.string().min(1),
    }),
  )
  .min(1);

export async function requestZenQuote(url: string, timeoutMs: number): Promise<ProviderCandidate> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new AdviceProviderError(
        `ZenQuotes request failed (${response.status})`,
        mapStatusToErrorState(response.status),
      );
    }

    const payload = zenQuoteSchema.safeParse(await response.json());
    if (!payload.success) {
      throw new AdviceProviderError("ZenQuotes payload is invalid", "invalid_payload");
    }

    const quote = payload.data[0];

    return {
      text: quote.q,
      source: "zen_quotes",
      sourceAttribution: `ZenQuotes API (${quote.a})`,
      confidence: 0.76,
      fallbackUsed: false,
      errorState: null,
    };
  } catch (error) {
    if (error instanceof AdviceProviderError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AdviceProviderError("ZenQuotes request timed out", "unavailable");
    }

    throw new AdviceProviderError("ZenQuotes request failed", "unavailable");
  } finally {
    clearTimeout(timeout);
  }
}
