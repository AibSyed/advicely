import { z } from "zod";
import type { ProviderCandidate } from "@/lib/api/types";
import { normalizeCardText } from "@/features/draw/text";
import { requestProviderJson } from "@/lib/api/request-provider-json";

const zenQuoteSchema = z
  .array(
    z.object({
      q: z.string().min(1),
      a: z.string().min(1),
    }),
  )
  .min(1);

export async function requestZenQuote(url: string, timeoutMs: number): Promise<ProviderCandidate> {
  const payload = await requestProviderJson({
    url,
    timeoutMs,
    schema: zenQuoteSchema,
    requestFailedMessage: "ZenQuotes request failed",
    invalidPayloadMessage: "ZenQuotes payload is invalid",
    timeoutMessage: "ZenQuotes request timed out",
  });
  const quote = payload[0];

  return {
    kind: "quote",
    text: normalizeCardText(quote.q),
    author: normalizeCardText(quote.a),
    source: "zen_quotes",
    sourceLabel: "ZenQuotes",
  };
}
