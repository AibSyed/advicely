import { CoachingStudio } from "@/components/coaching-studio";

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen text-zinc-100">
      <header className="mx-auto max-w-6xl px-6 pb-4 pt-10">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-200">Advicely Coach</p>
        <h1 className="font-heading text-5xl leading-tight">Daily coaching cards that convert insight into action.</h1>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Theme-driven coaching with reflection memory, resilient provider fallbacks, and a tighter behavioral loop designed for repeat use.
        </p>
      </header>
      <CoachingStudio />
    </main>
  );
}
