const blockedFragments = ["buy now", "click here", "http://", "https://"];
const practicalVerbPattern =
  /\b(start|choose|write|ask|set|plan|break|call|send|schedule|draft|list|pause|breathe|review|decide|test|clarify|define|focus|limit|prioritize|explain|communicate|commit|simplify|track|compare)\b/i;
const secondPersonPattern = /\b(you|your)\b/i;
const firstPersonPattern = /\b(i|me|my|mine)\b/i;
const nonPracticalPatterns = [
  /\bplot twist\b/i,
  /\beverybody makes mistakes\b/i,
  /\blook up at the stars\b/i,
  /\bcarry on\b/i,
  /\bit is what it is\b/i,
];

function repairMojibake(text: string): string {
  if (!/[ÃÂ][\u0080-\u00ff]/.test(text)) {
    return text;
  }

  try {
    return new TextDecoder().decode(Uint8Array.from(text, (char) => char.charCodeAt(0)));
  } catch {
    return text;
  }
}

export function normalizeAdviceText(text: string): string {
  return repairMojibake(text)
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

export function computeQualityScore(text: string): number {
  const normalized = normalizeAdviceText(text);
  if (normalized.length < 18) {
    return 0.1;
  }

  let score = 0.4;

  if (normalized.length >= 35 && normalized.length <= 180) {
    score += 0.25;
  }

  if (/[.!?]$/.test(normalized)) {
    score += 0.1;
  }

  if (/[A-Za-z]/.test(normalized) && /\s/.test(normalized)) {
    score += 0.15;
  }

  if (!containsBlockedFragment(normalized)) {
    score += 0.1;
  }

  return Math.max(0, Math.min(1, Number(score.toFixed(2))));
}

export function containsBlockedFragment(text: string): boolean {
  const lower = text.toLowerCase();
  return blockedFragments.some((fragment) => lower.includes(fragment));
}

export function looksNonPractical(text: string): boolean {
  return nonPracticalPatterns.some((pattern) => pattern.test(text));
}

export function hasPracticalVerb(text: string): boolean {
  return practicalVerbPattern.test(text);
}

export function isLowQualityAdvice(text: string): boolean {
  const normalized = normalizeAdviceText(text);
  const isSelfReflective = firstPersonPattern.test(normalized) && !secondPersonPattern.test(normalized);
  const hasAttribution = /\s[-—]\s[A-Za-z]/.test(normalized);

  return (
    normalized.length < 18 ||
    containsBlockedFragment(normalized) ||
    looksNonPractical(normalized) ||
    isSelfReflective ||
    hasAttribution ||
    !hasPracticalVerb(normalized) ||
    computeQualityScore(normalized) < 0.45
  );
}

export function summarizeAdvice(text: string, max = 88): string {
  const normalized = normalizeAdviceText(text);
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}
