import { z } from "zod";

const quoteSchema = z.object({
  content: z.string(),
});

export async function fetchQuotable(signal: AbortSignal) {
  const response = await fetch("https://api.quotable.io/random?maxLength=180", {
    signal,
    next: { revalidate: 120 },
  });
  if (!response.ok) {
    throw new Error(`Quotable failed (${response.status})`);
  }
  const payload = quoteSchema.parse(await response.json());
  return payload.content;
}
