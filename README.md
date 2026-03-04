# Advicely Coach

Advicely Coach is a rebuilt behavior-change micro-experience: themed guidance streams, reflection loops, and fast action prompts designed for repeat daily use.

## Highlights
- Theme-driven coaching sessions (focus, confidence, resilience, clarity).
- Reflection capture loop with lightweight session memory.
- Safe provider fallback to curated cards when live generation fails.
- Typed contracts from API route to UI rendering.

## Architecture
```mermaid
flowchart LR
  P[Player] --> UI[Next.js App Router UI]
  UI --> Q[TanStack Query Cache]
  Q --> RH[/app/api/coaching Route Handler]
  RH --> CP[Coaching Provider Adapter]
  CP --> Z[Zod Contract Validation]
  CP --> AS[(Advice Slip API)]
  CP --> FC[(Curated Coaching Cards)]
  Z --> UI
```

## Tech Stack
- Next.js 16 App Router
- React 19 + TypeScript (strict)
- TanStack Query v5
- Zod v4
- Tailwind CSS
- Vitest + Playwright

## Local Development
```bash
pnpm install
pnpm dev
```

## Verification Commands
```bash
pnpm run check
pnpm run test:e2e
pnpm run audit:high
```

## Environment
Copy `.env.example` to `.env.local` when overriding provider URL.

- `COACHING_PROVIDER_URL` optional endpoint override.

## Product Reinvention Notes
- Legacy random-advice spinner app removed.
- New product flow is engineered for retention and meaningful follow-through.
- Degraded mode preserves experience quality instead of failing hard.
