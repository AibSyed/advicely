import { describe, expect, it } from "vitest";
import { drawRequestSchema, drawResponseSchema } from "@/features/draw/contracts";

describe("draw request contract", () => {
  it("accepts a simple draw request", () => {
    const parsed = drawRequestSchema.safeParse({
      mode: "mixed",
      avoidRecentHashes: ["0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"],
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects unknown fields", () => {
    const parsed = drawRequestSchema.safeParse({
      mode: "advice",
      context: "no longer supported",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("draw response contract", () => {
  it("accepts a live quote card", () => {
    const parsed = drawResponseSchema.safeParse({
      card: {
        id: "card-1",
        kind: "quote",
        text: "Stay close to what steadies you.",
        author: "Advicely Reserve",
        source: "zen_quotes",
        sourceLabel: "ZenQuotes",
        provenance: "live",
        textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        drawnAt: "2026-03-01T00:00:00.000Z",
      },
      meta: {
        requestId: "req-1",
        drawnAt: "2026-03-01T00:00:00.000Z",
        outcomes: {
          adviceSlip: "skipped",
          zenQuotes: "accepted",
        },
      },
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects cards with missing provenance fields", () => {
    const parsed = drawResponseSchema.safeParse({
      card: {
        id: "card-1",
        kind: "advice",
        text: "Pick one useful move.",
        source: "advicely_reserve",
        sourceLabel: "Advicely Reserve",
        textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        drawnAt: "2026-03-01T00:00:00.000Z",
      },
      meta: {
        requestId: "req-1",
        drawnAt: "2026-03-01T00:00:00.000Z",
        outcomes: {
          adviceSlip: "duplicate",
          zenQuotes: "filtered",
        },
      },
    });

    expect(parsed.success).toBe(false);
  });
});
