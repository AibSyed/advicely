import { describe, expect, it } from "vitest";
import { adviceResponseSchema } from "@/features/advice/contracts";

describe("advice response contract", () => {
  it("accepts a valid response", () => {
    const parsed = adviceResponseSchema.safeParse({
      card: {
        id: "demo",
        headline: "Practical Signal",
        advice: "Pick one meaningful task and finish it before opening anything else.",
        microAction: "Set a 10 minute timer and execute.",
        reflectionPrompt: "What made this easier than expected?",
        toneProfile: "grounded",
        source: "advice_slip",
        sourceAttribution: "AdviceSlip API",
        freshnessMinutes: 0,
        confidence: 0.86,
        fallbackUsed: false,
        errorState: null,
        textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        generatedAt: "2026-03-01T00:00:00.000Z",
      },
      meta: {
        requestId: "req-1",
        generatedAt: "2026-03-01T00:00:00.000Z",
        providerHealth: {
          primary: "healthy",
          secondary: "healthy",
        },
        diagnostics: ["primary: accepted"],
      },
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid confidence", () => {
    const parsed = adviceResponseSchema.safeParse({
      card: {
        id: "demo",
        headline: "x",
        advice: "This text is long enough to pass minimum length checks.",
        microAction: "Do a next step.",
        reflectionPrompt: "Why now?",
        toneProfile: "grounded",
        source: "advice_slip",
        sourceAttribution: "AdviceSlip API",
        freshnessMinutes: 0,
        confidence: 3,
        fallbackUsed: false,
        errorState: null,
        textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        generatedAt: "2026-03-01T00:00:00.000Z",
      },
      meta: {
        requestId: "req-1",
        generatedAt: "2026-03-01T00:00:00.000Z",
        providerHealth: {
          primary: "healthy",
          secondary: "healthy",
        },
        diagnostics: ["primary: accepted"],
      },
    });

    expect(parsed.success).toBe(false);
  });
});
