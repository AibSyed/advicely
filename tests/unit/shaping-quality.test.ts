import { describe, expect, it } from "vitest";
import { normalizeAdviceText, summarizeAdvice } from "@/features/advice/quality";
import { buildAdaptiveAdvice } from "@/features/advice/shaping";

describe("quality utilities", () => {
  it("normalizes punctuation and whitespace", () => {
    const normalized = normalizeAdviceText("  Keep   going  “today”   ");
    expect(normalized).toBe('Keep going "today"');
  });

  it("summarizes long advice text", () => {
    const summarized = summarizeAdvice("A".repeat(200), 80);
    expect(summarized.length).toBeLessThanOrEqual(80);
    expect(summarized.endsWith("…")).toBe(true);
  });
});

describe("adaptive advice shaping", () => {
  it("adds intent-specific checklist for decision mode", () => {
    const shaped = buildAdaptiveAdvice(
      "Compare tradeoffs and move toward an option you can test quickly.",
      {
        context: "Should I switch jobs now or wait six months?",
        intent: "decision",
        style: "balanced",
        detail: "standard",
        avoidRecentHashes: [],
      },
    );

    expect(shaped.blocks.some((block) => block.type === "checklist")).toBe(true);
    expect(shaped.blocks.some((block) => block.type === "core_advice")).toBe(true);
  });

  it("caps blocks when short detail is requested", () => {
    const shaped = buildAdaptiveAdvice(
      "Start with one small planning task and protect an uninterrupted block.",
      {
        context: undefined,
        intent: "planning",
        style: "direct",
        detail: "short",
        avoidRecentHashes: [],
      },
    );

    expect(shaped.blocks.length).toBeLessThanOrEqual(2);
  });
});
