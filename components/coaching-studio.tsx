"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Share2, RefreshCcw } from "lucide-react";
import type { CoachingPayload } from "@/features/coaching/schema";

const themes: CoachingPayload["card"]["theme"][] = ["focus", "confidence", "resilience", "clarity"];

async function fetchCard(theme: CoachingPayload["card"]["theme"]) {
  const response = await fetch(`/api/coaching?theme=${theme}`);
  if (!response.ok) {
    throw new Error("Coaching unavailable");
  }
  return (await response.json()) as CoachingPayload;
}

export function CoachingStudio() {
  const [theme, setTheme] = useState<CoachingPayload["card"]["theme"]>("focus");
  const [journal, setJournal] = useState<string[]>([]);
  const query = useQuery({ queryKey: ["coaching-card", theme], queryFn: () => fetchCard(theme) });

  const card = query.data?.card;

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-14 pt-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6 rounded-3xl border border-rose-800/40 bg-gradient-to-br from-zinc-950 via-zinc-900 to-rose-950/40 p-6 shadow-2xl">
        <div className="flex items-center gap-2 text-rose-100">
          <Sparkles size={18} /> Guided Coaching Loop
        </div>

        <div className="flex flex-wrap gap-2">
          {themes.map((item) => (
            <button
              key={item}
              className={`rounded-full px-3 py-1 text-sm transition ${theme === item ? "bg-rose-400 text-zinc-950" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"}`}
              onClick={() => setTheme(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {query.isPending && <p className="text-zinc-300">Composing your coaching card...</p>}
        {query.isError && <p className="rounded-lg border border-rose-400/40 bg-rose-950/40 p-3 text-rose-100">Unable to fetch live coaching. Try again.</p>}

        {card ? (
          <article className="animate-float space-y-4 rounded-2xl border border-zinc-700 bg-zinc-950/70 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">{card.theme}</p>
            <h2 className="font-heading text-4xl leading-tight">{card.headline}</h2>
            <p className="text-lg text-zinc-100">{card.prompt}</p>
            <div className="space-y-2 rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 text-sm">
              <p><strong>Reflection:</strong> {card.reflection}</p>
              <p><strong>Micro-action:</strong> {card.microAction}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-rose-400 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-rose-300"
                onClick={() => setJournal((current) => [`${new Date().toLocaleString()}: ${card.prompt}`, ...current].slice(0, 8))}
              >
                Save reflection
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-zinc-200" onClick={() => query.refetch()}>
                <RefreshCcw size={14} /> Regenerate
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-zinc-200" onClick={() => navigator.clipboard.writeText(card.prompt)}>
                <Share2 size={14} /> Copy prompt
              </button>
            </div>
          </article>
        ) : null}
      </div>

      <aside className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
        <h3 className="font-heading text-2xl">Session History</h3>
        <p className="text-sm text-zinc-300">Your recent prompts are tracked as lightweight reflection memory.</p>
        <ul className="space-y-2 text-sm">
          {journal.length === 0 && <li className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-3 text-zinc-400">No reflections yet.</li>}
          {journal.map((entry) => (
            <li key={entry} className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-3 text-zinc-200">{entry}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
