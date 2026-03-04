import { z } from "zod";

const envSchema = z.object({
  COACHING_PROVIDER_URL: z.string().url().default("https://api.adviceslip.com/advice"),
});

export const env = envSchema.parse({
  COACHING_PROVIDER_URL: process.env.COACHING_PROVIDER_URL,
});
