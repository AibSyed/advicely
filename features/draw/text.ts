export function normalizeCardText(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function isFilteredText(text: string): boolean {
  const normalized = normalizeCardText(text);
  const words = normalized.match(/[A-Za-z0-9']+/g) ?? [];

  if (normalized.length < 12 || words.length < 3) {
    return true;
  }

  if (!/[A-Za-z]/.test(normalized)) {
    return true;
  }

  if (/^(.)\1{7,}$/.test(normalized.replace(/\s+/g, ""))) {
    return true;
  }

  return false;
}
