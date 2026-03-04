import { describe, expect, it } from "vitest";
import { coachingPayloadSchema } from "@/features/coaching/schema";

describe("coachingPayloadSchema", () => {
  it("accepts a valid coaching card", () => {
    const parsed = coachingPayloadSchema.safeParse({
      card: {
        id: "focus-1",
        theme: "focus",
        headline: "Do less, better",
        prompt: "What matters most?",
        reflection: "Think deeper.",
        microAction: "Write your next step.",
      },
      source: "test",
      generatedAt: "2026-03-01T00:00:00Z",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects unknown themes", () => {
    const parsed = coachingPayloadSchema.safeParse({
      card: {
        id: "x",
        theme: "unknown",
      },
      source: "test",
      generatedAt: "bad",
    });

    expect(parsed.success).toBe(false);
  });
});
