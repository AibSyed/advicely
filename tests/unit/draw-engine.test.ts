import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProviderCandidate } from "@/lib/api/types";
import { sha256Hex } from "@/lib/utils/hash";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/api/providers/advice-slip", () => ({
  requestAdviceSlip: vi.fn(),
}));

vi.mock("@/lib/api/providers/zen-quotes", () => ({
  requestZenQuote: vi.fn(),
}));

import { drawCard } from "@/lib/api/draw-engine";
import { requestAdviceSlip } from "@/lib/api/providers/advice-slip";
import { requestZenQuote } from "@/lib/api/providers/zen-quotes";

describe("drawCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a live provider card when the source succeeds", async () => {
    vi.mocked(requestAdviceSlip).mockResolvedValue({
      kind: "advice",
      text: "Pick the next useful move before you optimize the whole week.",
      source: "advice_slip",
      sourceLabel: "AdviceSlip",
    } satisfies ProviderCandidate);

    const response = await drawCard({
      request: {
        mode: "advice",
        avoidRecentHashes: [],
      },
    });

    expect(response.card.provenance).toBe("live");
    expect(response.card.source).toBe("advice_slip");
    expect(response.card.textHash).toBe(sha256Hex(response.card.text));
    expect(response.meta.outcomes).toEqual({
      adviceSlip: "accepted",
      zenQuotes: "skipped",
    });
    expect(requestZenQuote).not.toHaveBeenCalled();
  });

  it("falls back to the reserve when the live result is a duplicate", async () => {
    const duplicateText = "Pick the next useful move before you optimize the whole week.";

    vi.mocked(requestAdviceSlip).mockResolvedValue({
      kind: "advice",
      text: duplicateText,
      source: "advice_slip",
      sourceLabel: "AdviceSlip",
    } satisfies ProviderCandidate);

    const response = await drawCard({
      request: {
        mode: "advice",
        avoidRecentHashes: [sha256Hex(duplicateText)],
      },
    });

    expect(response.card.provenance).toBe("fallback");
    expect(response.card.source).toBe("advicely_reserve");
    expect(response.card.fallbackReason).toBe("duplicate");
    expect(response.meta.outcomes).toEqual({
      adviceSlip: "duplicate",
      zenQuotes: "skipped",
    });
  });
});
