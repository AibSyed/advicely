import { describe, expect, it } from "vitest";
import { isFilteredText, normalizeCardText } from "@/features/draw/text";

describe("draw text utilities", () => {
  it("normalizes smart quotes and whitespace", () => {
    expect(normalizeCardText("  Keep   going  “today” ")).toBe('Keep going "today"');
  });

  it("filters obviously weak content without judging practicality", () => {
    expect(isFilteredText("hi")).toBe(true);
    expect(isFilteredText(".......")).toBe(true);
    expect(isFilteredText("Do the next honest thing.")).toBe(false);
  });
});
