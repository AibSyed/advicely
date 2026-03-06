import { z } from "zod";
import type { ProviderCandidate } from "@/lib/api/types";
import { normalizeCardText } from "@/features/draw/text";
import { requestProviderJson } from "@/lib/api/request-provider-json";

const adviceSlipSchema = z.object({
  slip: z.object({
    advice: z.string().min(1),
  }),
});

export async function requestAdviceSlip(url: string, timeoutMs: number): Promise<ProviderCandidate> {
  const payload = await requestProviderJson({
    url,
    timeoutMs,
    schema: adviceSlipSchema,
    requestFailedMessage: "AdviceSlip request failed",
    invalidPayloadMessage: "AdviceSlip payload is invalid",
    timeoutMessage: "AdviceSlip request timed out",
  });

  return {
    kind: "advice",
    text: normalizeCardText(payload.slip.advice),
    source: "advice_slip",
    sourceLabel: "AdviceSlip",
  };
}
