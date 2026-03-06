"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { FiCopy, FiSearch, FiTrash2 } from "react-icons/fi";
import { AppNav } from "@/components/app-nav";
import { SourceCardView } from "@/components/source-card";
import { Button, FilterChip, PageIntro, Panel } from "@/components/ui/primitives";
import type { DrawSource, SourceCardKind } from "@/features/draw/contracts";
import { notifyInfo, notifySuccess } from "@/features/feedback/notify";
import type { SavedCardVM } from "@/features/library/contracts";
import { matchesTextQuery } from "@/features/library/query";
import { createCopyCard, getLibraryState, removeSavedCard, updateSavedCardNote } from "@/features/library/storage";

export function SavedLibrary() {
  const router = useRouter();
  const [savedCards, setSavedCards] = useState<SavedCardVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | SourceCardKind>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | DrawSource>("all");

  useEffect(() => {
    setSavedCards(getLibraryState().savedCards);
  }, []);

  const filteredCards = useMemo(
    () =>
      savedCards
        .filter((card) => (kindFilter === "all" ? true : card.kind === kindFilter))
        .filter((card) => (sourceFilter === "all" ? true : card.source === sourceFilter))
        .filter((card) => matchesTextQuery(searchQuery, [card.text, card.author, card.sourceLabel, card.note])),
    [savedCards, kindFilter, searchQuery, sourceFilter],
  );

  function handleRemove(cardId: string) {
    const nextState = removeSavedCard(cardId);
    setSavedCards(nextState.savedCards);
    notifySuccess({
      title: "Removed from your library",
      description: "The card is still available in recent draws if you need it again.",
    });
  }

  function handleOpenCopyView(card: SavedCardVM) {
    const copyCard = createCopyCard(card, card.note);
    notifyInfo({
      title: "Copy view ready",
      description: "The copy view keeps the source attached and leaves your note optional.",
    });
    router.push(`/copy/${copyCard.id}` as Route);
  }

  function handleNoteChange(cardId: string, note: string) {
    const nextState = updateSavedCardNote(cardId, note);
    setSavedCards(nextState.savedCards);
  }

  return (
    <div className="page-shell page-shell--wide">
      <div className="page-stack">
        <PageIntro
          eyebrow="Library"
          title="Your library"
          description="Keep the cards that earn a second look, annotate them with private notes, and pull them back into focus whenever you need them."
        />

        <AppNav />

        <div className="filter-layout">
          <Panel className="search-panel search-panel--wide">
            <div className="search-field">
              <FiSearch aria-hidden="true" />
              <input
                className="ui-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                placeholder="Search cards, authors, or notes"
                aria-label="Search library"
              />
            </div>
          </Panel>

          <div className="filter-layout__stack">
            <Panel compact>
              <p className="field-label">Card type</p>
              <div className="chip-row">
                {(["all", "advice", "quote"] as const).map((filter) => (
                  <FilterChip key={filter} active={kindFilter === filter} onClick={() => setKindFilter(filter)}>
                    {filter === "all" ? "All" : filter[0].toUpperCase() + filter.slice(1)}
                  </FilterChip>
                ))}
              </div>
            </Panel>

            <Panel compact>
              <p className="field-label">Source</p>
              <div className="chip-row">
                {(["all", "advice_slip", "zen_quotes", "advicely_reserve"] as const).map((filter) => (
                  <FilterChip key={filter} active={sourceFilter === filter} onClick={() => setSourceFilter(filter)}>
                    {filter === "all"
                      ? "All"
                      : filter === "advice_slip"
                        ? "AdviceSlip"
                        : filter === "zen_quotes"
                          ? "ZenQuotes"
                          : "Reserve"}
                  </FilterChip>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <Panel className="empty-state">
            <h2 className="empty-state__title">No cards match this view.</h2>
            <p className="empty-state__body">Clear a filter or save a new card from the deck.</p>
          </Panel>
        ) : null}

        <div className="card-stack">
          {filteredCards.map((card) => (
            <SourceCardView
              key={card.id}
              card={card}
              note={card.note}
              compact
              footer={
                <div className="footer-stack">
                  <p className="meta-line">
                    Saved {new Date(card.savedAt).toLocaleString()} · {card.sourceLabel}
                  </p>
                  <div>
                    <label className="field-label" htmlFor={`note-${card.id}`}>
                      Edit private note
                    </label>
                    <textarea
                      id={`note-${card.id}`}
                      className="ui-textarea"
                      value={card.note ?? ""}
                      onChange={(event) => handleNoteChange(card.id, event.currentTarget.value.slice(0, 320))}
                      placeholder="Why this card matters to you"
                      aria-label={`Edit note for ${card.text}`}
                    />
                  </div>
                  <div className="action-row">
                    <Button tone="primary" size="sm" onClick={() => handleOpenCopyView(card)}>
                      <span className="button-inline">
                        <FiCopy aria-hidden="true" />
                        <span>Open copy view</span>
                      </span>
                    </Button>
                    <Button tone="secondary" size="sm" onClick={() => handleRemove(card.id)}>
                      <span className="button-inline">
                        <FiTrash2 aria-hidden="true" />
                        <span>Remove</span>
                      </span>
                    </Button>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
