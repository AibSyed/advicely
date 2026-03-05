import { z } from "zod";
import { AdviceProviderError, mapStatusToErrorState } from "@/lib/api/provider-error";
import type { ProviderCandidate } from "@/lib/api/types";

const adviceSlipSchema = z.object({
  slip: z.object({
    advice: z.string().min(1),
  }),
});

export async function requestAdviceSlip(url: string, timeoutMs: number): Promise<ProviderCandidate> {
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
        `AdviceSlip request failed (${response.status})`,
        mapStatusToErrorState(response.status),
      );
    }

    const payload = adviceSlipSchema.safeParse(await response.json());
    if (!payload.success) {
      throw new AdviceProviderError("AdviceSlip payload is invalid", "invalid_payload");
    }

    return {
      text: payload.data.slip.advice,
      source: "advice_slip",
      sourceAttribution: "AdviceSlip API",
      confidence: 0.82,
      fallbackUsed: false,
      errorState: null,
    };
  } catch (error) {
    if (error instanceof AdviceProviderError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AdviceProviderError("AdviceSlip request timed out", "unavailable");
    }

    throw new AdviceProviderError("AdviceSlip request failed", "unavailable");
  } finally {
    clearTimeout(timeout);
  }
}
