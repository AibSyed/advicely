import "server-only";
import { z } from "zod";

const envSchema = z.object({
  ADVICE_SLIP_URL: z.string().url().default("https://api.adviceslip.com/advice"),
  ZEN_QUOTES_RANDOM_URL: z.string().url().default("https://zenquotes.io/api/random"),
  DRAW_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(500).max(10000).default(3200),
});

export const env = envSchema.parse({
  ADVICE_SLIP_URL: process.env.ADVICE_SLIP_URL,
  ZEN_QUOTES_RANDOM_URL: process.env.ZEN_QUOTES_RANDOM_URL,
  DRAW_REQUEST_TIMEOUT_MS: process.env.DRAW_REQUEST_TIMEOUT_MS,
});
