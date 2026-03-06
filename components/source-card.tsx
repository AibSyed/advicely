import type { ReactNode } from "react";
import type { SourceCardVM } from "@/features/draw/contracts";
import { getCardEyebrow, getCardKindLabel, getFallbackMessage } from "@/features/draw/presentation";
import { Panel, Pill } from "@/components/ui/primitives";
import { cn } from "@/lib/utils/cn";

interface SourceCardProps {
  card: SourceCardVM;
  note?: string;
  footer?: ReactNode;
  compact?: boolean;
}

export function SourceCardView({ card, note, footer, compact = false }: SourceCardProps) {
  const fallbackMessage = getFallbackMessage(card.fallbackReason);

  return (
    <Panel className={cn("source-card", compact && "source-card--compact")}>
      <div className="source-card__glow" aria-hidden="true" />
      <div className="source-card__stack">
        <div className="source-card__pills">
          <Pill>{getCardKindLabel(card)}</Pill>
          <Pill tone={card.provenance === "live" ? "accent" : "muted"}>{card.provenance === "live" ? "Live pull" : "Reserve draw"}</Pill>
        </div>

        <p className="source-card__eyebrow">{getCardEyebrow(card)}</p>
        <h2 className="source-card__title">{card.text}</h2>
        {card.author ? <p className="source-card__author">- {card.author}</p> : null}
        {fallbackMessage ? <p className="source-card__fallback">{fallbackMessage}</p> : null}

        {note ? (
          <div className="note-card">
            <p className="note-card__eyebrow">Private note</p>
            <p className="note-card__body">{note}</p>
          </div>
        ) : null}

        {footer ? <div>{footer}</div> : null}
      </div>
    </Panel>
  );
}
