import "server-only";
import { z } from "zod";

const envSchema = z.object({
  ADVICE_PROVIDER_PRIMARY_URL: z.string().url().default("https://api.adviceslip.com/advice"),
  ADVICE_PROVIDER_SECONDARY_URL: z.string().url().default("https://zenquotes.io/api/random"),
  ADVICE_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(500).max(10000).default(3200),
});

export const env = envSchema.parse({
  ADVICE_PROVIDER_PRIMARY_URL: process.env.ADVICE_PROVIDER_PRIMARY_URL,
  ADVICE_PROVIDER_SECONDARY_URL: process.env.ADVICE_PROVIDER_SECONDARY_URL,
  ADVICE_REQUEST_TIMEOUT_MS: process.env.ADVICE_REQUEST_TIMEOUT_MS,
});
