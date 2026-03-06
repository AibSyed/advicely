"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { AppNav } from "@/components/app-nav";
import { SourceCardView } from "@/components/source-card";
import { Button, PageIntro, Panel, Spinner } from "@/components/ui/primitives";
import { notifyError, notifySuccess } from "@/features/feedback/notify";
import { buildCopyCardText } from "@/features/library/copy-text";
import type { CopyCardVM } from "@/features/library/contracts";
import { getCopyCardById } from "@/features/library/storage";

interface CopyExperienceProps {
  copyId: string;
}

export function CopyExperience({ copyId }: CopyExperienceProps) {
  const [copyCard, setCopyCard] = useState<CopyCardVM | null | undefined>(undefined);
  const [includeNote, setIncludeNote] = useState(false);

  useEffect(() => {
    setCopyCard(getCopyCardById(copyId));
  }, [copyId]);

  async function handleCopy() {
    if (!copyCard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buildCopyCardText(copyCard, includeNote));
      notifySuccess({
        title: "Copied to clipboard",
        description: includeNote ? "Your private note was included in this copy." : "Your private note stayed out of this copy.",
      });
    } catch {
      notifyError({
        title: "Clipboard unavailable",
        description: "Try copying from a browser tab with clipboard access enabled.",
      });
    }
  }

  return (
    <div className="page-shell page-shell--narrow">
      <div className="page-stack">
        <PageIntro
          eyebrow="Copy"
          title="Copy card"
          description="Source text stays intact, attribution stays visible, and your private note stays hidden unless you explicitly include it."
        />

        <AppNav />

        {copyCard === undefined ? (
          <Panel className="loading-panel">
            <div className="loading-row">
              <Spinner label="Checking this local copy" />
              <p>Checking this local copy...</p>
            </div>
          </Panel>
        ) : copyCard ? (
          <SourceCardView
            card={copyCard.card}
            note={includeNote ? copyCard.note : undefined}
            footer={
              <div className="footer-stack">
                <p className="meta-line">
                  Source: {copyCard.card.sourceLabel} · Created {new Date(copyCard.createdAt).toLocaleString()}
                </p>
                {copyCard.note ? (
                  <label className="checkbox-row">
                    <input type="checkbox" checked={includeNote} onChange={(event) => setIncludeNote(event.currentTarget.checked)} />
                    <span>Include private note when copying</span>
                  </label>
                ) : (
                  <p className="meta-line">No private note is attached to this card.</p>
                )}
                <Button tone="primary" className="button-inline-self" onClick={handleCopy}>
                  <span className="button-inline">
                    <FiCopy aria-hidden="true" />
                    <span>Copy card text</span>
                  </span>
                </Button>
              </div>
            }
          />
        ) : (
          <Panel className="empty-state">
            <h2 className="empty-state__title">We could not find that local copy.</h2>
            <p className="empty-state__body">
              This copy view only works in the same browser that created it. Draw a fresh card and make a new local copy here.
            </p>
            <p className="empty-state__link">
              <NextLink href="/">Draw a new card</NextLink>
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}
