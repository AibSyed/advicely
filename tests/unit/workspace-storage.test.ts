import { beforeEach, describe, expect, it } from "vitest";
import type { AdviceCardVM } from "@/features/advice/contracts";
import {
  clearWorkspace,
  createShareCard,
  getShareCardById,
  getWorkspaceState,
  recordGeneratedAdvice,
  saveAdviceCard,
} from "@/features/workspace/storage";

const baseCard: AdviceCardVM = {
  id: "card-1",
  headline: "Start with one clear step",
  summary: "Choose one action you can finish in ten minutes.",
  blocks: [
    {
      type: "core_advice",
      text: "Choose one action you can finish in ten minutes.",
    },
  ],
  intent: "quick",
  style: "balanced",
  detail: "standard",
  source: "local_fallback",
  sourceAttribution: "Advicely Curated Catalog",
  confidence: 0.71,
  fallbackUsed: true,
  errorState: "partial",
  textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  generatedAt: "2026-03-01T00:00:00.000Z",
};

describe("workspace storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearWorkspace();
  });

  it("records history and saves cards", () => {
    const historyState = recordGeneratedAdvice(baseCard);
    expect(historyState.history).toHaveLength(1);

    const savedState = saveAdviceCard(baseCard);
    expect(savedState.savedCards).toHaveLength(1);
    expect(getWorkspaceState().savedCards[0]?.headline).toBe(baseCard.headline);
  });

  it("creates and resolves share cards", () => {
    recordGeneratedAdvice(baseCard);
    const shareCard = createShareCard(baseCard);

    const resolved = getShareCardById(shareCard.id);
    expect(resolved?.card.id).toBe(baseCard.id);
  });
});
