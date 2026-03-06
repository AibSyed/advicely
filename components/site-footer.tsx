"use client";

import { usePathname } from "next/navigation";
import { Panel, Pill } from "@/components/ui/primitives";

const routeNotes: Record<string, string> = {
  "/": "Deck open. Pull a fresh line, then keep only what you want to revisit.",
  "/saved": "Library open. Saved cards and private notes are here when you want to revisit them.",
  "/history": "Recent draws open. Skim what surfaced lately and keep anything worth another look.",
  "/sources": "Sources open. See where each card comes from and when the reserve steps in.",
};

function resolveRouteNote(pathname: string): string {
  if (pathname.startsWith("/copy/")) {
    return "Copy view open. Take a clean, attributed copy and include your note only if you want to.";
  }

  return routeNotes[pathname] ?? routeNotes["/"];
}

export function SiteFooter() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__backdrop" aria-hidden="true" />
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <Panel tone="dark" className="site-footer__panel">
            <Pill>Advicely</Pill>
            <p className="site-footer__headline">A good line at the right moment is worth keeping.</p>
            <p className="site-footer__copy">
              Pull something fresh, save what resonates, and leave yourself a note when it helps. The app keeps attribution close and your private notes local.
            </p>
          </Panel>

          <Panel tone="dark" className="site-footer__panel">
            <Pill tone="accent">Deck sources</Pill>
            <p className="site-footer__copy">Cards are pulled from two live sources with a clearly-labeled local reserve when needed.</p>
            <ul className="site-footer__source-list">
              <li className="site-footer__source-item">
                <span className="site-footer__source-name">AdviceSlip</span>
                <span className="site-footer__source-role">Live advice lines</span>
              </li>
              <li className="site-footer__source-item">
                <span className="site-footer__source-name">ZenQuotes</span>
                <span className="site-footer__source-role">Live quote lines</span>
              </li>
              <li className="site-footer__source-item">
                <span className="site-footer__source-name">Advicely Reserve</span>
                <span className="site-footer__source-role">Local fallback when live draws fail checks</span>
              </li>
            </ul>
          </Panel>

          <Panel tone="dark" className="site-footer__panel">
            <Pill tone="ember">Use judgment</Pill>
            <p className="site-footer__callout">{resolveRouteNote(pathname)}</p>
            <p className="site-footer__copy">
              This app is for reflection and perspective only. Do not treat any card as medical, legal, financial, or safety guidance.
            </p>
          </Panel>
        </div>

        <div className="site-footer__meta">
          <p>©{year} Created by Shoaib (Aib) Syed</p>
          <p>Random by design. Save selectively. Copy with context.</p>
        </div>
      </div>
    </footer>
  );
}
