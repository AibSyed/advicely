import {
  type AdviceBlockVM,
  type AdviceIntent,
  type AdviceRequestVM,
  type AdviceStyle,
} from "@/features/advice/contracts";
import {
  hasPracticalVerb,
  looksNonPractical,
  normalizeAdviceText,
  summarizeAdvice,
} from "@/features/advice/quality";

interface ShapedAdvice {
  headline: string;
  summary: string;
  blocks: AdviceBlockVM[];
}

const intentHeadlines: Record<AdviceIntent, string> = {
  quick: "Quick Next Step",
  decision: "Decision Guide",
  communication: "Message Plan",
  planning: "Action Plan",
  stress: "Steady Next Move",
  general: "Practical Guidance",
};

const intentSummaries: Record<AdviceIntent, string> = {
  quick: "One clear move you can take right now.",
  decision: "A structured way to choose without spiraling.",
  communication: "Clear language you can use in real conversations.",
  planning: "A simple sequence to move from idea to execution.",
  stress: "A calmer way to reduce pressure and regain control.",
  general: "Useful guidance you can apply immediately.",
};

const highRiskContextPattern = /\b(legal|medical|health|safety|danger|injury|financial|debt|tax|lawsuit|self-harm)\b/i;
const stopwords = new Set([
  "about",
  "after",
  "again",
  "being",
  "could",
  "from",
  "have",
  "into",
  "just",
  "need",
  "that",
  "this",
  "with",
  "without",
  "work",
  "week",
  "your",
]);

function titleFromContext(intent: AdviceIntent, context?: string): string {
  const fallback = intentHeadlines[intent];
  if (!context) {
    return fallback;
  }

  const normalized = context
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.?!]+$/, "");

  if (normalized.length < 12) {
    return fallback;
  }

  if (normalized.length <= 56) {
    return `About: ${normalized}`;
  }

  return `About: ${normalized.slice(0, 53).trimEnd()}...`;
}

function applyStyle(text: string, style: AdviceStyle): string {
  const cleaned = normalizeAdviceText(text);

  if (style === "direct") {
    return normalizeAdviceText(cleaned.replace(/\b(maybe|perhaps|might)\b/gi, ""));
  }

  if (style === "supportive") {
    if (/you can/i.test(cleaned)) {
      return cleaned;
    }
    return `You can handle this. ${cleaned}`;
  }

  if (style === "creative") {
    return `${cleaned} Try one fresh angle before repeating the same approach.`;
  }

  return cleaned;
}

function fallbackCoreAdvice(request: AdviceRequestVM): string {
  const contextText = request.context
    ? request.context.trim().replace(/\s+/g, " ").slice(0, 120)
    : null;

  if (request.intent === "quick") {
    return contextText
      ? `Pick the smallest useful move for "${contextText}" and complete it within the next 10 minutes.`
      : "Pick one useful task you can finish in 10 minutes and do it before switching context.";
  }

  if (request.intent === "decision") {
    return "Choose the option that is easiest to test, easiest to reverse, and most likely to teach you something fast.";
  }

  if (request.intent === "communication") {
    return contextText
      ? "State your boundary in one sentence, then offer one realistic alternative with a date."
      : "Say what you need in one sentence, then add one concrete next step.";
  }

  if (request.intent === "planning") {
    return contextText
      ? `Define what done looks like for "${contextText}", then split it into the next three concrete actions.`
      : "Define what done looks like, then split the work into the next three concrete actions.";
  }

  if (request.intent === "stress") {
    return "Lower pressure first, then pick one controllable action you can complete right now.";
  }

  return "Choose one practical action, do it now, then adjust based on what you learn.";
}

function keywords(text: string): Set<string> {
  const raw = normalizeAdviceText(text).toLowerCase().match(/[a-z]{4,}/g) ?? [];
  return new Set(raw.filter((word) => !stopwords.has(word)));
}

function isContextRelevant(advice: string, context?: string): boolean {
  if (!context) {
    return true;
  }

  const adviceKeywords = keywords(advice);
  const contextKeywords = keywords(context);

  if (contextKeywords.size === 0) {
    return true;
  }

  for (const token of contextKeywords) {
    if (adviceKeywords.has(token)) {
      return true;
    }
  }

  return false;
}

function resolveCoreAdvice(baseAdvice: string, request: AdviceRequestVM): string {
  const styled = applyStyle(baseAdvice, request.style);

  if (
    looksNonPractical(styled) ||
    !hasPracticalVerb(styled) ||
    (request.context !== undefined && !isContextRelevant(styled, request.context))
  ) {
    return fallbackCoreAdvice(request);
  }

  return styled;
}

function planningSteps(context?: string): string[] {
  const scopeLine = context
    ? `Define what success means for: ${context.trim().replace(/\s+/g, " ").slice(0, 120)}.`
    : "Define what success looks like in one sentence.";

  return [scopeLine, "Break the work into the next three concrete actions.", "Start the first action within the next 10 minutes."];
}

function quickSteps(context?: string): string[] {
  if (context) {
    return [
      `Write one sentence for the real problem in: ${context.trim().replace(/\s+/g, " ").slice(0, 100)}.`,
      "Do the smallest useful action in the next 10 minutes.",
    ];
  }

  return [
    "Pick one thing that would make today easier.",
    "Do the smallest useful step now, before opening new tasks.",
  ];
}

function decisionChecklist(): string[] {
  return [
    "Compare impact, effort, and reversibility for each option.",
    "Prefer the option that gives fast feedback with lower downside.",
    "Set a deadline so uncertainty does not drag on.",
  ];
}

function communicationScript(context?: string): string {
  if (context) {
    return "Try saying: \"I want to be transparent about capacity this week. I can't take this on right now, but I can help with [specific alternative] by [date].\"";
  }

  return "Try saying: \"Here is what I can commit to now: [specific scope] by [date].\"";
}

function communicationChecklist(): string[] {
  return [
    "Lead with your request, not the full backstory.",
    "Use one concrete example to make your point clear.",
    "End with a specific next step and owner.",
  ];
}

function stressReframe(context?: string): string {
  if (!context) {
    return "Focus on one controllable step right now, not the entire problem at once.";
  }

  return `Treat this as a sequence, not a cliff. For "${context.trim().slice(0, 120)}", choose only the next controllable step.`;
}

function stressChecklist(): string[] {
  return [
    "Pause for 30 seconds to lower physical stress.",
    "Name one thing you can control in the next hour.",
    "Take that single step before evaluating everything else.",
  ];
}

function deepBoostBlocks(request: AdviceRequestVM): AdviceBlockVM[] {
  if (request.intent === "decision") {
    return [{ type: "steps", items: ["List your top two options.", "Write one experiment for each option.", "Run the lowest-risk experiment first."] }];
  }

  if (request.intent === "planning") {
    return [{ type: "checklist", items: ["Timebox the first action.", "Remove one distraction before starting.", "Review progress before adding more work."] }];
  }

  if (request.intent === "communication") {
    return [{ type: "checklist", items: communicationChecklist() }];
  }

  if (request.intent === "stress") {
    return [{ type: "checklist", items: stressChecklist() }];
  }

  return [{ type: "checklist", items: ["Keep the next step under 10 minutes.", "Observe what changed after acting.", "Adjust based on results, not mood."] }];
}

function detailCap(detail: AdviceRequestVM["detail"]): number {
  if (detail === "short") {
    return 2;
  }

  if (detail === "standard") {
    return 3;
  }

  return 4;
}

function uniqueBlocks(blocks: AdviceBlockVM[]): AdviceBlockVM[] {
  const seen = new Set<string>();
  const result: AdviceBlockVM[] = [];

  for (const block of blocks) {
    const key = JSON.stringify(block);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(block);
  }

  return result;
}

function buildSummary(intent: AdviceIntent, context?: string): string {
  if (!context) {
    return intentSummaries[intent];
  }

  return summarizeAdvice(`${intentSummaries[intent]} Focus: ${context.trim().replace(/\s+/g, " ")}`, 180);
}

export function buildAdaptiveAdvice(baseAdvice: string, request: AdviceRequestVM): ShapedAdvice {
  const coreAdvice = resolveCoreAdvice(baseAdvice, request);

  const blocks: AdviceBlockVM[] = [
    {
      type: "core_advice",
      text: coreAdvice,
    },
  ];

  if (request.intent === "planning") {
    blocks.push({ type: "steps", items: planningSteps(request.context) });
  }

  if (request.intent === "decision") {
    blocks.push({ type: "checklist", items: decisionChecklist() });
  }

  if (request.intent === "communication") {
    blocks.push({ type: "script", text: communicationScript(request.context) });
  }

  if (request.intent === "stress") {
    blocks.push({ type: "reframe", text: stressReframe(request.context) });

    if (request.context && highRiskContextPattern.test(request.context)) {
      blocks.push({
        type: "caution",
        text: "If this involves legal, medical, safety, or financial risk, verify with a qualified professional before acting.",
      });
    }
  }

  if (request.intent === "general" || request.intent === "quick") {
    blocks.push({ type: "steps", items: quickSteps(request.context) });
  }

  if (request.detail === "deep") {
    blocks.push(...deepBoostBlocks(request));
  }

  const capped = uniqueBlocks(blocks).slice(0, detailCap(request.detail));

  return {
    headline: titleFromContext(request.intent, request.context),
    summary: buildSummary(request.intent, request.context),
    blocks: capped,
  };
}
