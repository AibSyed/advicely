import { describe, expect, it } from "vitest";
import { parseClientDrawResponse } from "@/features/draw/client-guard";

describe("parseClientDrawResponse", () => {
  it("accepts a valid draw response payload", () => {
    expect(
      parseClientDrawResponse({
        card: {
          id: "card-1",
          kind: "quote",
          text: "Keep the thought that helps; leave the performance around it behind.",
          author: "Advicely Reserve",
          source: "advicely_reserve",
          sourceLabel: "Advicely Reserve",
          provenance: "fallback",
          fallbackReason: "provider_unavailable",
          textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          drawnAt: "2026-03-01T00:00:00.000Z",
        },
        meta: {
          requestId: "req-1",
          drawnAt: "2026-03-01T00:00:00.000Z",
          outcomes: {
            adviceSlip: "unavailable",
            zenQuotes: "skipped",
          },
        },
      }),
    ).toMatchObject({
      card: {
        source: "advicely_reserve",
      },
    });
  });

  it("rejects malformed draw payloads", () => {
    expect(() =>
      parseClientDrawResponse({
        card: {
          id: "card-1",
          kind: "quote",
          text: "Short",
          source: "zen_quotes",
          sourceLabel: "ZenQuotes",
          provenance: "live",
          textHash: "bad-hash",
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
      }),
    ).toThrow(/hash is invalid/i);
  });
});
