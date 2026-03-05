import { describe, expect, it } from "vitest";
import {
  adviceRequestSchema,
  adviceResponseSchema,
} from "@/features/advice/contracts";

describe("advice request contract", () => {
  it("accepts optional context with intent/style/detail", () => {
    const parsed = adviceRequestSchema.safeParse({
      context: "I need to say no to more tasks this week.",
      intent: "communication",
      style: "direct",
      detail: "deep",
      avoidRecentHashes: ["0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"],
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects oversize context", () => {
    const parsed = adviceRequestSchema.safeParse({
      context: "x".repeat(601),
      intent: "general",
      style: "balanced",
      detail: "standard",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("advice response contract", () => {
  it("accepts adaptive advice blocks", () => {
    const parsed = adviceResponseSchema.safeParse({
      card: {
        id: "demo",
        headline: "Decision support",
        summary: "Choose the option that gives learning with less downside.",
        blocks: [
          { type: "core_advice", text: "Start with the reversible option." },
          {
            type: "checklist",
            items: [
              "Compare effort and upside.",
              "Pick the option you can test this week.",
            ],
          },
        ],
        intent: "decision",
        style: "balanced",
        detail: "standard",
        source: "advice_slip",
        sourceAttribution: "AdviceSlip API",
        confidence: 0.82,
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

  it("rejects invalid block payload", () => {
    const parsed = adviceResponseSchema.safeParse({
      card: {
        id: "demo",
        headline: "Decision support",
        summary: "Choose the option that gives learning with less downside.",
        blocks: [
          // invalid shape for discriminated union
          { type: "steps", text: "this should be an array" },
        ],
        intent: "decision",
        style: "balanced",
        detail: "standard",
        source: "advice_slip",
        sourceAttribution: "AdviceSlip API",
        confidence: 0.82,
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
