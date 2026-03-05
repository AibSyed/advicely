const blockedFragments = ["buy now", "click here", "http://", "https://"];

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

export function isLowQualityAdvice(text: string): boolean {
  const normalized = normalizeAdviceText(text);
  return normalized.length < 18 || containsBlockedFragment(normalized) || computeQualityScore(normalized) < 0.45;
}

export function summarizeAdvice(text: string, max = 88): string {
  const normalized = normalizeAdviceText(text);
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}
