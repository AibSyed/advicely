const bannedPatterns = [
  /bleach/i,
  /harm\s+yourself/i,
  /suicide/i,
  /kill\s+yourself/i,
  /hurt\s+someone/i,
  /violence/i,
  /illegal/i,
  /hate\s+speech/i,
  /nobody\s+cares/i,
  /missing\s+a?\s*few\s+payments/i,
  /try\s+missing/i,
];

const actionVerbs = [
  "build",
  "focus",
  "write",
  "start",
  "choose",
  "commit",
  "ship",
  "plan",
  "review",
  "practice",
  "schedule",
  "reduce",
];

export function isUnsafeAdvice(text: string) {
  return bannedPatterns.some((pattern) => pattern.test(text));
}

export function isLowQualityAdvice(text: string) {
  const trimmed = text.trim();
  if (trimmed.length < 30 || trimmed.split(/\s+/).length < 6) {
    return true;
  }

  const lower = trimmed.toLowerCase();
  const hasActionVerb = actionVerbs.some((verb) => lower.includes(verb));
  return !hasActionVerb;
}
