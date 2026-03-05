# Advicely v5 Utility-First Rebuild Checklist

## Scope
- Branch target: `codex/advicely-v5-utility-rebuild`
- Product target: practical advice utility (context-optional generation, save/history/share)
- Compatibility stance: zero-legacy, breaking changes allowed

## Preflight Baseline
- [x] Capture baseline command results from pre-rewrite state:
  - [x] `pnpm run lint` (pass)
  - [x] `pnpm run typecheck` (failed on stale `.next` route validator drift to removed routes)
  - [x] `pnpm run test` (pass)
  - [x] `pnpm run test:e2e` (pass)
  - [x] `pnpm run build` (pass)
  - [x] `pnpm run audit:high` (pass)
- [x] Record known baseline failures and causes

## Implementation
- [x] Purge v4 momentum/gamified modules and routes
- [x] Redesign advice contracts to v5 adaptive block model
- [x] Rebuild advice engine for contextual shaping + adaptive blocks
- [x] Rewrite `/api/advice` to POST + request body validation
- [x] Replace UI with Advice Studio, Saved, History, Share
- [x] Replace local persistence schema/key to `advicely:v5:workspace`
- [x] Fix typed-routes/typegen pipeline and route typing issues
- [x] Rewrite tests (unit + e2e) for v5 behavior
- [x] Rewrite README and architecture docs for v5

## Acceptance Criteria
- [x] Core flow: generate advice (with and without context) works end-to-end
- [x] Adaptive blocks render without fixed forced labels
- [x] Save/history/share flows work with local persistence
- [x] Provider outage and invalid payloads degrade gracefully
- [x] Accessibility baseline: keyboard, focus-visible, live-region status
- [x] Quality gates all pass

## Verification Log
- `pnpm run lint` (pass)
- `pnpm run typecheck` (pass)
- `pnpm run test` (pass)
- `pnpm run test:e2e` (pass)
- `pnpm run build` (pass)
- `pnpm run docs:check` (pass)
- `pnpm run audit:high` (pass)
- `pnpm run check` (pass)
- Chrome DevTools MCP QA:
  - console errors: none after switching dev to webpack mode
  - mobile/desktop route sanity: `/`, `/saved`, `/history`, `/share/[id]` checked
  - performance trace (`/`): LCP 147ms, CLS 0.00 (local lab run)

## 2026-03-04 UI/UX Polish Pass
- [x] Reproduced odd output states in Chrome DevTools MCP (`Quick + Deep` no-context and context mismatch scenarios)
- [x] Tightened provider quality/relevance heuristics for practical output
- [x] Reworked shaping to remove generic deep warning behavior and enforce actionable blocks
- [x] Simplified end-user terminology (removed confidence-fit badges from primary surfaces)
- [x] Revalidated desktop/mobile output sanity via DevTools snapshots

### Polish Verification
- `pnpm run check` (pass)
- `pnpm run test:e2e` (pass)
- `pnpm run docs:check` (pass)
- `pnpm run audit:high` (pass)
- DevTools MCP checks: no console errors; practical output verified for `quick/deep` and `communication/deep` flows
