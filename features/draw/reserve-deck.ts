import type { DrawMode, SourceCardKind } from "@/features/draw/contracts";

interface ReserveDeckEntry {
  kind: SourceCardKind;
  text: string;
  author?: string;
  modes: DrawMode[];
}

export const reserveDeck: ReserveDeckEntry[] = [
  {
    kind: "advice",
    text: "If a day feels noisy, finish one small promise to yourself before you absorb anyone else's urgency.",
    modes: ["advice", "mixed"],
  },
  {
    kind: "advice",
    text: "When a decision feels tangled, write the smallest reversible move and judge that instead of the entire future.",
    modes: ["advice", "mixed"],
  },
  {
    kind: "advice",
    text: "If you need to say no, make the boundary clear first and the apology optional.",
    modes: ["advice", "mixed"],
  },
  {
    kind: "advice",
    text: "Protect the first twenty minutes of your energy for something you would still care about next week.",
    modes: ["advice", "mixed"],
  },
  {
    kind: "advice",
    text: "A useful plan is small enough to start before your mood improves.",
    modes: ["advice", "mixed"],
  },
  {
    kind: "quote",
    text: "What steadies you is worth revisiting.",
    author: "Advicely Reserve",
    modes: ["quote", "mixed"],
  },
  {
    kind: "quote",
    text: "Clarity often arrives after one honest sentence, not after ten more tabs.",
    author: "Advicely Reserve",
    modes: ["quote", "mixed"],
  },
  {
    kind: "quote",
    text: "A gentle pace can still be forward motion.",
    author: "Advicely Reserve",
    modes: ["quote", "mixed"],
  },
  {
    kind: "quote",
    text: "You do not need a dramatic reset to begin again today.",
    author: "Advicely Reserve",
    modes: ["quote", "mixed"],
  },
  {
    kind: "quote",
    text: "Keep the thought that helps; leave the performance around it behind.",
    author: "Advicely Reserve",
    modes: ["quote", "mixed"],
  },
];
