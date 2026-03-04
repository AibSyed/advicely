import { afterEach, describe, expect, it, vi } from "vitest";
import { coachingResponseSchema } from "@/features/coaching/schema";
import { applyReflection, defaultProgression } from "@/lib/state/progression";
import { getCoaching } from "@/lib/domain/coaching";
import { isLowQualityAdvice } from "@/lib/safety/policy";

vi.mock("@/lib/api/providers/advice-slip", () => ({
  fetchAdviceSlip: vi.fn(),
}));

vi.mock("@/lib/api/providers/quotable", () => ({
  fetchQuotable: vi.fn(),
}));

import { fetchAdviceSlip } from "@/lib/api/providers/advice-slip";
import { fetchQuotable } from "@/lib/api/providers/quotable";

describe("coaching contracts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns normalized provider payload when primary succeeds", async () => {
    vi.mocked(fetchAdviceSlip).mockResolvedValue("Build momentum with one high-leverage action before noon.");

    const result = await getCoaching("focus");
    const parsed = coachingResponseSchema.parse(result);

    expect(parsed.card.source).toBe("adviceslip");
    expect(parsed.card.fallbackUsed).toBe(false);
  });

  it("falls back when providers are unavailable", async () => {
    vi.mocked(fetchAdviceSlip).mockRejectedValue(new Error("unavailable"));
    vi.mocked(fetchQuotable).mockRejectedValue(new Error("unavailable"));

    const result = await getCoaching("clarity");
    const parsed = coachingResponseSchema.parse(result);

    expect(parsed.card.source).toBe("fallback");
    expect(parsed.card.fallbackUsed).toBe(true);
  });

  it("applies reflection progression with streak and xp", () => {
    const now = new Date("2026-03-04T13:00:00.000Z");

    const updated = applyReflection(
      defaultProgression,
      {
        id: "focus-1",
        theme: "focus",
        text: "I will ship one measurable deliverable before lunch.",
        createdAt: now.toISOString(),
        xpAwarded: 15,
      },
      now
    );

    expect(updated.totalXp).toBe(15);
    expect(updated.streakDays).toBe(1);
    expect(updated.sessionsCompleted).toBe(1);
    expect(updated.reflections).toHaveLength(1);
    expect(updated.lastCheckInDate).toBe("2026-03-04");
  });

  it("rejects cynical or non-actionable advice text", () => {
    expect(isLowQualityAdvice("If you think nobody cares if you're alive, try missing a few payments.")).toBe(true);
    expect(isLowQualityAdvice("Choose one difficult task and finish the first draft before lunch.")).toBe(false);
  });
});
