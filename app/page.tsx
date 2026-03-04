import { CoachingStudio } from "@/components/coaching-studio";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-rose-950/70 text-zinc-100">
      <header className="mx-auto max-w-6xl px-6 pb-4 pt-10">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-200">Advicely Coach</p>
        <h1 className="font-heading text-5xl leading-tight">Daily coaching cards that convert insight into action.</h1>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Advicely has been rebuilt as a behavior-focused coaching studio with themed guidance streams, reflection loops, and graceful fallback operation.
        </p>
      </header>
      <CoachingStudio />
    </main>
  );
}
