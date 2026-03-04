import { z } from "zod";

const adviceSchema = z.object({
  slip: z.object({ advice: z.string() }),
});

export async function fetchAdviceSlip(signal: AbortSignal) {
  const endpoint = process.env.COACHING_PROVIDER_URL ?? "https://api.adviceslip.com/advice";
  const response = await fetch(endpoint, { signal, cache: "no-store" });
  if (!response.ok) {
    throw new Error(`AdviceSlip failed (${response.status})`);
  }
  const payload = adviceSchema.parse(await response.json());
  return payload.slip.advice;
}
