import { beforeEach, describe, expect, it } from "vitest";
import type { SourceCardVM } from "@/features/draw/contracts";
import {
  clearLibrary,
  createShareCard,
  getLibraryState,
  getShareCardById,
  recordDrawnCard,
  saveCard,
  updateSavedCardNote,
} from "@/features/library/storage";

const baseCard: SourceCardVM = {
  id: "card-1",
  kind: "advice",
  text: "Pick one useful move and do it before opening three more tabs.",
  source: "local_collection",
  sourceLabel: "Advicely Collection",
  provenance: "fallback",
  fallbackReason: "provider_unavailable",
  textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  drawnAt: "2026-03-01T00:00:00.000Z",
};

describe("library storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearLibrary();
  });

  it("records history and saves cards with notes", () => {
    const historyState = recordDrawnCard(baseCard);
    expect(historyState.history).toHaveLength(1);

    const savedState = saveCard(baseCard, "Use this when work starts sprawling.");
    expect(savedState.savedCards).toHaveLength(1);
    expect(getLibraryState().savedCards[0]?.note).toBe("Use this when work starts sprawling.");
  });

  it("updates saved notes and resolves share cards", () => {
    saveCard(baseCard, "first note");
    const nextState = updateSavedCardNote(baseCard.id, "updated note");
    expect(nextState.savedCards[0]?.note).toBe("updated note");

    const shareCard = createShareCard(baseCard, "updated note");
    const resolved = getShareCardById(shareCard.id);
    expect(resolved?.note).toBe("updated note");
  });
});
