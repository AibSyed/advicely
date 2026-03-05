# Advicely v4 Relaunch Checklist

## Baseline Capture (Pre-rewrite)
- Branch target: `codex/ux-relaunch-2026-advicely`
- Baseline command results (before purge):
  - `pnpm run check` passed
  - `pnpm run test:e2e` passed
  - `pnpm run audit:high` passed
- Baseline notes:
  - Prior implementation diverged from old Advicely one-click advice identity.
  - Existing architecture needed hard reset to prevent mixed legacy patterns.

## Rewrite Acceptance Criteria
- [x] Purge legacy domain files in `app/components/features/lib/tests/docs`
- [x] Rebuild route map: `/`, `/momentum`, `/library`, `/share/[id]`, `/api/advice`
- [x] Implement hybrid provider pipeline with validation, scoring, dedupe, fallback
- [x] Implement local momentum persistence v4 schema
- [x] Rebuild README and architecture docs with GitHub-safe Mermaid labels
- [x] Run full verification ladder
- [x] Run UX/performance sanity pass in Chrome DevTools
- [x] Prepare merge summary with evidence

## Verification Log
- `pnpm run docs:check` passed (markdown lint, link check, Mermaid validator).
- `pnpm run check` passed (`lint`, `typecheck`, `test`, `build`).
- `pnpm run test:e2e` passed (primary reactor flow).
- `pnpm run audit:high` passed (no high/critical vulnerabilities).
- `pnpm outdated` result: only `eslint@10` available; intentionally pinned to `eslint@9.39.3` due current Next plugin ecosystem peer ranges.
- Chrome DevTools MCP QA:
  - Console errors resolved after Chakra hydration hardening (`--webpack` scripts + hydration-safe client state initialization).
  - Mobile viewport check (`390x844`) confirmed responsive route rendering on `/`, `/momentum`, `/library`.
  - Trace summary on `/`: LCP `408ms`, CLS `0.00` (no throttling).
