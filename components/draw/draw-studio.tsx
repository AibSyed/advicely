"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { FiBookmark, FiCopy, FiEye, FiRefreshCw, FiShuffle } from "react-icons/fi";
import { AppNav } from "@/components/app-nav";
import { SourceCardView } from "@/components/source-card";
import { Button, FilterChip, PageIntro, Panel, Pill, Spinner } from "@/components/ui/primitives";
import { notifyError, notifyInfo, notifySuccess } from "@/features/feedback/notify";
import type { DrawMode, DrawRequestVM, DrawResponseVM } from "@/features/draw/contracts";
import { parseClientDrawResponse } from "@/features/draw/client-guard";
import { getModeDescription, getModeLabel } from "@/features/draw/presentation";
import {
  createCopyCard,
  findSavedCardByHash,
  getLibraryState,
  getRecentHashes,
  isCardSaved,
  recordDrawnCard,
  saveCard,
  updatePreferences,
} from "@/features/library/storage";

const modeOptions: DrawMode[] = ["mixed", "advice", "quote"];

const heroSignals = [
  {
    icon: FiShuffle,
    title: "Fresh every time",
    body: "Switch between advice, quotes, or a mixed deck whenever you want a different kind of pull.",
  },
  {
    icon: FiBookmark,
    title: "Worth keeping",
    body: "Save the cards that land, then come back to them later with your own note beside them.",
  },
  {
    icon: FiEye,
    title: "Source included",
    body: "Every card keeps its attribution so you always know whether it came from a live source or the reserve.",
  },
] as const;

const mobileHighlights = [
  "Advice and quotes on one clean deck.",
  "Save only what is worth revisiting.",
  "Attribution stays attached.",
] as const;

interface LibrarySnapshot {
  historyCount: number;
  savedCount: number;
}

async function fetchDraw(request: DrawRequestVM): Promise<DrawResponseVM> {
  const response = await fetch("/api/draw", {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error ?? "Draw request failed");
  }

  return parseClientDrawResponse(payload);
}

export function DrawStudio() {
  const router = useRouter();
  const [mode, setMode] = useState<DrawMode>("mixed");
  const [latestResponse, setLatestResponse] = useState<DrawResponseVM | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [snapshot, setSnapshot] = useState<LibrarySnapshot>({ historyCount: 0, savedCount: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const state = getLibraryState();
    setMode(state.preferences.lastMode);
    setSnapshot({
      historyCount: state.history.length,
      savedCount: state.savedCards.length,
    });
  }, []);

  const latestCard = latestResponse?.card ?? null;
  const savedCard = useMemo(() => (latestCard ? findSavedCardByHash(latestCard.textHash) : undefined), [latestCard]);
  const cardSaved = latestCard ? isCardSaved(latestCard) : false;

  useEffect(() => {
    if (!latestCard) {
      setNoteDraft("");
      return;
    }

    setNoteDraft(savedCard?.note ?? "");
  }, [latestCard, savedCard]);

  async function handleDraw() {
    setIsLoading(true);
    updatePreferences(mode);

    try {
      const payload: DrawRequestVM = {
        mode,
        avoidRecentHashes: getRecentHashes(),
      };
      const response = await fetchDraw(payload);
      const nextState = recordDrawnCard(response.card);

      setLatestResponse(response);
      setSnapshot({
        historyCount: nextState.history.length,
        savedCount: nextState.savedCards.length,
      });
      notifySuccess({
        title: response.card.provenance === "live" ? "Fresh draw ready" : "Reserve draw ready",
        description:
          response.card.provenance === "live"
            ? `${response.card.sourceLabel} delivered a new ${response.card.kind}.`
            : "The reserve stepped in because a live pull did not clear the deck rules.",
      });
    } catch (error) {
      notifyError({
        title: "Could not draw a new card",
        description: error instanceof Error ? error.message : "Try again in a moment.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSave() {
    if (!latestCard) {
      return;
    }

    const nextState = saveCard(latestCard, noteDraft);
    setSnapshot((current) => ({ ...current, savedCount: nextState.savedCards.length }));
    notifySuccess({
      title: cardSaved ? "Library card updated" : "Saved to your library",
      description: cardSaved ? "Your local note changed." : "The card is now waiting in your library.",
    });
  }

  function handleOpenCopyView() {
    if (!latestCard) {
      return;
    }

    const copyCard = createCopyCard(latestCard, noteDraft);
    notifyInfo({
      title: "Copy view ready",
      description: "Attribution stays visible there, and your note stays optional.",
    });
    router.push(`/copy/${copyCard.id}` as Route);
  }

  return (
    <div className="page-shell page-shell--wide">
      <div className="page-stack">
        <PageIntro
          eyebrow="Advicely"
          title="Find a line worth keeping."
          description="Draw a piece of advice or a quote, save the ones that stick, and keep a private note when you want to remember why."
        />

        <Panel className="mobile-highlights">
          <ul className="bullet-list">
            {mobileHighlights.map((highlight) => (
              <li key={highlight} className="bullet-list__item">
                <span className="bullet-list__dot" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="signal-grid">
          {heroSignals.map((signal) => {
            const Icon = signal.icon;

            return (
              <Panel key={signal.title} compact className="signal-card">
                <div className="signal-card__row">
                  <span className="signal-card__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div className="signal-card__copy">
                    <p className="signal-card__title">{signal.title}</p>
                    <p className="signal-card__body">{signal.body}</p>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>

        <AppNav />

        <div className="layout-split layout-split--deck">
          <div className="layout-split__aside">
            <Panel className="control-panel">
              <div className="field-stack">
                <div>
                  <p className="field-label">Draw mode</p>
                  <div className="chip-row">
                    {modeOptions.map((option) => (
                      <FilterChip key={option} active={mode === option} onClick={() => setMode(option)} aria-pressed={mode === option}>
                        {getModeLabel(option)}
                      </FilterChip>
                    ))}
                  </div>
                  <p className="field-help">{getModeDescription(mode)}</p>
                </div>

                <div>
                  <label className="field-label" htmlFor="note-draft">
                    Optional personal note
                  </label>
                  <textarea
                    id="note-draft"
                    className="ui-textarea"
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.currentTarget.value.slice(0, 320))}
                    placeholder="Why this card matters to you"
                    maxLength={320}
                    disabled={!latestCard}
                  />
                </div>

                <div className="action-grid">
                  <Button tone="primary" size="lg" block onClick={handleDraw} disabled={isLoading}>
                    <span className="button-inline">
                      {isLoading ? <Spinner label="Drawing a card" /> : <FiRefreshCw aria-hidden="true" />}
                      <span>{isLoading ? "Drawing..." : "Draw a card"}</span>
                    </span>
                  </Button>
                  <Button tone="secondary" size="lg" block onClick={handleSave} disabled={!latestCard}>
                    <span className="button-inline">
                      <FiBookmark aria-hidden="true" />
                      <span>{cardSaved ? "Update saved note" : "Save to library"}</span>
                    </span>
                  </Button>
                </div>

                <Button tone="ghost" className="copy-trigger" onClick={handleOpenCopyView} disabled={!latestCard}>
                  <span className="button-inline">
                    <FiCopy aria-hidden="true" />
                    <span>Open copy view</span>
                  </span>
                </Button>
              </div>
            </Panel>
          </div>

          <div className="layout-split__main">
            {latestCard ? (
              <SourceCardView
                card={latestCard}
                note={noteDraft || undefined}
                footer={
                  <div className="card-meta">
                    <Pill tone={latestCard.provenance === "live" ? "accent" : "muted"}>{latestCard.sourceLabel}</Pill>
                    <Pill tone="translucent">Saved {snapshot.savedCount}</Pill>
                    <Pill tone="translucent">Recent {snapshot.historyCount}</Pill>
                  </div>
                }
              />
            ) : (
              <Panel className="empty-state">
                <Pill tone="muted">Deck waiting</Pill>
                <h2 className="empty-state__title">Draw a card to open the deck.</h2>
                <p className="empty-state__body">
                  Advice mode pulls from AdviceSlip, quote mode pulls from ZenQuotes, and mixed lets the deck decide.
                </p>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
