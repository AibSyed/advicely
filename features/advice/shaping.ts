import {
  type AdviceBlockVM,
  type AdviceIntent,
  type AdviceRequestVM,
  type AdviceStyle,
} from "@/features/advice/contracts";
import { normalizeAdviceText, summarizeAdvice } from "@/features/advice/quality";

interface ShapedAdvice {
  headline: string;
  summary: string;
  blocks: AdviceBlockVM[];
}

const intentHeadlines: Record<AdviceIntent, string> = {
  quick: "Quick Direction",
  decision: "Decision Support",
  communication: "Message Guidance",
  planning: "Execution Plan",
  stress: "Calm and Act",
  general: "Useful Advice",
};

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

  if (normalized.length <= 64) {
    return normalized;
  }

  return `${normalized.slice(0, 61).trimEnd()}...`;
}

function applyStyle(text: string, style: AdviceStyle): string {
  const cleaned = normalizeAdviceText(text);

  if (style === "direct") {
    return cleaned.replace(/\b(maybe|perhaps|might)\b/gi, "");
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

function planningSteps(context?: string): string[] {
  const scopeLine = context
    ? `Define what success means for: ${context.trim().replace(/\s+/g, " ").slice(0, 120)}.`
    : "Define what success looks like in one sentence.";

  return [
    scopeLine,
    "Break the work into the next three concrete actions.",
    "Start the first action within the next 10 minutes.",
  ];
}

function decisionChecklist(): string[] {
  return [
    "Compare impact, effort, and reversibility for each option.",
    "Prefer the option that gives fast feedback with lower downside.",
    "Set a deadline for deciding so uncertainty does not drag on.",
  ];
}

function communicationScript(context?: string): string {
  const topic = context
    ? context.trim().replace(/\s+/g, " ").slice(0, 120)
    : "this";

  return `Try saying: "I want to align on ${topic}. My request is [specific ask], and I can commit to [your contribution]."`;
}

function stressReframe(context?: string): string {
  if (!context) {
    return "Focus on one controllable step right now, not the entire problem at once.";
  }

  return `Treat this as a sequence, not a cliff. For "${context.trim().slice(0, 120)}", choose the next controllable step only.`;
}

function detailCap(detail: AdviceRequestVM["detail"]): number {
  if (detail === "short") {
    return 2;
  }

  if (detail === "standard") {
    return 3;
  }

  return 5;
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

export function buildAdaptiveAdvice(baseAdvice: string, request: AdviceRequestVM): ShapedAdvice {
  const styledAdvice = applyStyle(baseAdvice, request.style);

  const blocks: AdviceBlockVM[] = [
    {
      type: "core_advice",
      text: styledAdvice,
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
    blocks.push({
      type: "caution",
      text: "If this involves legal, medical, safety, or financial risk, verify with a qualified professional before acting.",
    });
  }

  if ((request.intent === "general" || request.intent === "quick") && request.context) {
    blocks.push({ type: "steps", items: planningSteps(request.context).slice(1) });
  }

  if (request.detail === "deep" && request.intent !== "stress") {
    blocks.push({
      type: "caution",
      text: "Pressure can distort judgment. Keep the next step small, observable, and easy to adjust.",
    });
  }

  const capped = uniqueBlocks(blocks).slice(0, detailCap(request.detail));

  return {
    headline: titleFromContext(request.intent, request.context),
    summary: summarizeAdvice(styledAdvice, 150),
    blocks: capped,
  };
}
