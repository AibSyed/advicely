"use client";

import { usePathname } from "next/navigation";
import { Panel, Pill } from "@/components/ui/primitives";

const routeNotes: Record<string, string> = {
  "/": "Deck open. Take a fresh pull and keep only the lines you would want to see again.",
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
            <Pill tone="accent">Deck makeup</Pill>
            <div className="site-footer__pill-row">
              <Pill tone="translucent">AdviceSlip</Pill>
              <Pill tone="translucent">ZenQuotes</Pill>
              <Pill tone="translucent">Advicely Reserve</Pill>
            </div>
            <p className="site-footer__copy">
              When a live pull fails, repeats, or comes back too weak to keep, the deck falls back to the Advicely Reserve instead of pretending the result is still live.
            </p>
          </Panel>

          <Panel tone="dark" className="site-footer__panel">
            <Pill tone="ember">Use judgment</Pill>
            <p className="site-footer__callout">{resolveRouteNote(pathname)}</p>
            <p className="site-footer__copy">
              Advicely is for reflection, not for decisions that could put health, safety, finances, or wellbeing at risk. Use common sense before acting on anything you pull here.
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
