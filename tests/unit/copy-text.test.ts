import { describe, expect, it } from "vitest";
import type { CopyCardVM } from "@/features/library/contracts";
import { buildCopyCardText } from "@/features/library/copy-text";

const liveCard: CopyCardVM = {
  id: "copy-1",
  createdAt: "2026-03-01T00:00:00.000Z",
  card: {
    id: "card-1",
    kind: "quote",
    text: "Leave room for the version of the day you are actually having.",
    author: "Advicely Reserve",
    source: "zen_quotes",
    sourceLabel: "ZenQuotes",
    provenance: "live",
    textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    drawnAt: "2026-03-01T00:00:00.000Z",
  },
  note: "Useful when I start overcomplicating things.",
};

describe("buildCopyCardText", () => {
  it("keeps attribution and omits notes by default", () => {
    expect(buildCopyCardText(liveCard, false)).toBe(
      ['Leave room for the version of the day you are actually having.', "— Advicely Reserve", "", "Source: ZenQuotes"].join("\n"),
    );
  });

  it("includes provenance and notes when requested", () => {
    const fallbackCard: CopyCardVM = {
      ...liveCard,
      card: {
        ...liveCard.card,
        provenance: "fallback",
        source: "advicely_reserve",
        sourceLabel: "Advicely Reserve",
        fallbackReason: "provider_unavailable",
      },
    };

    expect(buildCopyCardText(fallbackCard, true)).toContain("Provenance: Advicely Reserve");
    expect(buildCopyCardText(fallbackCard, true)).toContain("Private note: Useful when I start overcomplicating things.");
  });
});
