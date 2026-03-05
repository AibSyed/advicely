import { describe, expect, it } from "vitest";
import { applyToneProfile } from "@/features/advice/tone";
import { computeQualityScore, isLowQualityAdvice, normalizeAdviceText } from "@/features/advice/quality";

describe("quality and tone utilities", () => {
  it("normalizes spacing and punctuation quotes", () => {
    const normalized = normalizeAdviceText("  Keep   going  “today”   ");
    expect(normalized).toBe('Keep going "today"');
  });

  it("flags very short or spammy content as low quality", () => {
    expect(isLowQualityAdvice("Click here now")).toBe(true);
    expect(isLowQualityAdvice("Ship one concrete step before opening social apps.")).toBe(false);
  });

  it("produces differentiated tone output", () => {
    const calm = applyToneProfile("Take one deep breath before deciding.", "calm");
    const bold = applyToneProfile("Take the first meaningful step immediately", "bold");

    expect(calm.advice.includes("!")).toBe(false);
    expect(bold.advice.endsWith("!")).toBe(true);
    expect(computeQualityScore(bold.advice)).toBeGreaterThan(0.4);
  });
});
