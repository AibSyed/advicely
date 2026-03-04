import type { Theme } from "@/features/coaching/schema";

const fallbackPrompts: Record<Theme, string> = {
  focus: "Choose one meaningful task and remove every non-essential step between now and completion.",
  confidence: "Act as if your current uncertainty is temporary evidence-gathering, not identity.",
  resilience: "Treat today’s friction as training load, then capture one capability it strengthened.",
  clarity: "Rewrite your current goal in one sentence that can be tested by tonight.",
};

export function getFallbackPrompt(theme: Theme) {
  return fallbackPrompts[theme];
}
