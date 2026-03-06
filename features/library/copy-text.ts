import type { CopyCardVM } from "@/features/library/contracts";

export function buildCopyCardText(card: CopyCardVM, includeNote: boolean): string {
  const lines = [card.card.text];

  if (card.card.author) {
    lines.push(`— ${card.card.author}`);
  }

  lines.push("");
  lines.push(`Source: ${card.card.sourceLabel}`);

  if (card.card.provenance === "fallback") {
    lines.push("Provenance: Advicely Reserve");
  }

  if (includeNote && card.note) {
    lines.push("");
    lines.push(`Private note: ${card.note}`);
  }

  return lines.join("\n").trim();
}
