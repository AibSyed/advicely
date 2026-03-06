import { AppNav } from "@/components/app-nav";
import { PageIntro, Panel, Pill } from "@/components/ui/primitives";

export function SourceGuide() {
  return (
    <div className="page-shell page-shell--medium">
      <div className="page-stack">
        <PageIntro
          eyebrow="Source notes"
          title="Where the cards come from."
          description="These pulls are random, not tailored. Advicely helps you save, note, and revisit them without obscuring where they came from."
        />

        <AppNav />

        <div className="card-stack">
          <Panel>
            <div className="source-guide__pills">
              <Pill>Live advice</Pill>
              <Pill tone="accent">AdviceSlip</Pill>
            </div>
            <h2 className="section-title">AdviceSlip</h2>
            <p className="section-copy">
              Advice mode pulls one random advice slip from AdviceSlip and presents it as a source card, not a personalized recommendation.
            </p>
            <p className="section-copy">
              Official site:{" "}
              <a href="https://api.adviceslip.com/" target="_blank" rel="noreferrer">
                api.adviceslip.com
              </a>
            </p>
          </Panel>

          <Panel>
            <div className="source-guide__pills">
              <Pill>Live quote</Pill>
              <Pill tone="ember">ZenQuotes</Pill>
            </div>
            <h2 className="section-title">ZenQuotes</h2>
            <p className="section-copy">Quote mode pulls one random quote from ZenQuotes and preserves the author when it is provided.</p>
            <p className="section-copy">
              Official docs:{" "}
              <a href="https://docs.zenquotes.io/zenquotes-documentation/" target="_blank" rel="noreferrer">
                docs.zenquotes.io
              </a>
            </p>
          </Panel>

          <Panel>
            <div className="source-guide__pills">
              <Pill>Reserve</Pill>
              <Pill tone="muted">Advicely Reserve</Pill>
            </div>
            <h2 className="section-title">Advicely Reserve</h2>
            <p className="section-copy">
              When a live pull fails, repeats, or returns unusable data, Advicely uses its own reserve deck instead of pretending the result is still live.
            </p>
            <p className="section-copy">
              Private notes stay in browser storage under <code>advicely:v6:library</code> and are never sent to AdviceSlip or ZenQuotes.
            </p>
          </Panel>
        </div>

        <Panel tone="dark">
          <h2 className="section-title section-title--light">Use judgment</h2>
          <p className="section-copy section-copy--light">
            Advicely is for reflection and curation. It is not medical, legal, financial, crisis, or otherwise professional advice.
          </p>
        </Panel>
      </div>
    </div>
  );
}
