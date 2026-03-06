"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { FiBookmark, FiCopy, FiSearch } from "react-icons/fi";
import { AppNav } from "@/components/app-nav";
import { SourceCardView } from "@/components/source-card";
import { Button, FilterChip, PageIntro, Panel } from "@/components/ui/primitives";
import type { SourceCardKind, SourceCardVM } from "@/features/draw/contracts";
import { getCardEyebrow } from "@/features/draw/presentation";
import { notifyInfo, notifySuccess } from "@/features/feedback/notify";
import { matchesTextQuery } from "@/features/library/query";
import { createCopyCard, getLibraryState, saveCard } from "@/features/library/storage";

export function HistoryTimeline() {
  const router = useRouter();
  const [historyCards, setHistoryCards] = useState<SourceCardVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | SourceCardKind>("all");
  const [savedHashes, setSavedHashes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const state = getLibraryState();
    setHistoryCards(state.history);
    setSavedHashes(new Set(state.savedCards.map((card) => card.textHash)));
  }, []);

  const filteredCards = useMemo(
    () =>
      historyCards
        .filter((card) => (kindFilter === "all" ? true : card.kind === kindFilter))
        .filter((card) => matchesTextQuery(searchQuery, [card.text, card.author, card.sourceLabel, getCardEyebrow(card)])),
    [historyCards, kindFilter, searchQuery],
  );

  function handleSave(card: SourceCardVM) {
    const nextState = saveCard(card);
    setSavedHashes(new Set(nextState.savedCards.map((saved) => saved.textHash)));
    notifySuccess({
      title: "Saved to your library",
      description: "You can add a private note from the library whenever you want.",
    });
  }

  function handleOpenCopyView(card: SourceCardVM) {
    const copyCard = createCopyCard(card);
    notifyInfo({
      title: "Copy view ready",
      description: "You can copy the card text there with attribution intact.",
    });
    router.push(`/copy/${copyCard.id}` as Route);
  }

  return (
    <div className="page-shell page-shell--wide">
      <div className="page-stack">
        <PageIntro
          eyebrow="Recent"
          title="Recent draws"
          description="A quiet trail of what the deck has surfaced lately. Save anything worth revisiting or open a clean copy with attribution intact."
        />

        <AppNav />

        <div className="history-filters">
          <Panel className="search-panel search-panel--wide">
            <div className="search-field">
              <FiSearch aria-hidden="true" />
              <input
                className="ui-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                placeholder="Search text, author, or source"
                aria-label="Search history"
              />
            </div>
          </Panel>

          <Panel compact>
            <p className="field-label">Filter by type</p>
            <div className="chip-row">
              {(["all", "advice", "quote"] as const).map((filter) => (
                <FilterChip key={filter} active={kindFilter === filter} onClick={() => setKindFilter(filter)}>
                  {filter === "all" ? "All" : filter[0].toUpperCase() + filter.slice(1)}
                </FilterChip>
              ))}
            </div>
          </Panel>
        </div>

        {filteredCards.length === 0 ? (
          <Panel className="empty-state">
            <h2 className="empty-state__title">No recent draws yet.</h2>
            <p className="empty-state__body">Draw a card from the deck to start building a history.</p>
          </Panel>
        ) : null}

        <div className="card-stack">
          {filteredCards.map((card) => (
            <SourceCardView
              key={card.id}
              card={card}
              compact
              footer={
                <div className="footer-stack">
                  <p className="meta-line">
                    {card.sourceLabel} · Drawn {new Date(card.drawnAt).toLocaleString()}
                  </p>
                  <div className="action-row">
                    <Button tone="primary" size="sm" onClick={() => handleSave(card)} disabled={savedHashes.has(card.textHash)}>
                      <span className="button-inline">
                        <FiBookmark aria-hidden="true" />
                        <span>{savedHashes.has(card.textHash) ? "Saved" : "Save to library"}</span>
                      </span>
                    </Button>
                    <Button tone="secondary" size="sm" onClick={() => handleOpenCopyView(card)}>
                      <span className="button-inline">
                        <FiCopy aria-hidden="true" />
                        <span>Open copy view</span>
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
