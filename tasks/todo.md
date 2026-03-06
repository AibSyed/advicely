# Advicely v6 Honesty-First Reframe Checklist

## Scope
- Branch target: `codex/advicely-v6-honesty-reframe`
- Product target: honest random advice-and-quotes draw app with save/history/share value
- Compatibility stance: zero-legacy, breaking changes allowed

## Ground Truth Baseline
- [x] Verified provider behavior:
  - [x] AdviceSlip returns random advice text
  - [x] ZenQuotes returns random quote text and author data
- [x] Verified current v5 misalignment:
  - [x] `context` is not forwarded to upstream providers
  - [x] `steps`, `checklist`, `script`, `reframe`, `caution` are locally fabricated
  - [x] `backup guidance` maps to local fallback content and is unclear to users
  - [x] deployed home page still logs a production React runtime error

## Implementation
- [x] Replace v5 `advice` contracts with v6 `draw` contracts and normalized source-card models
- [x] Remove contextual shaping, practicality synthesis, and fabricated block presentation
- [x] Replace `/api/advice` with `/api/draw` and normalize provider/fallback provenance
- [x] Replace workspace schema/key with `advicely:v6:library`
- [x] Rebuild `/`, `/saved`, `/history`, `/share/[id]`, and add `/sources`
- [x] Add optional personal notes that remain local-only and are excluded from share output by default
- [x] Rewrite metadata, README, architecture docs, and `.env.example` to reflect honest product behavior
- [x] Fix the browser runtime error and add a console-clean e2e assertion
- [x] Remove all dead v5 files, labels, routes, and tests

## Acceptance Criteria
- [x] Draw mode works for `advice`, `quote`, and `mixed`
- [x] UI only presents normalized raw source content plus plain-language provenance
- [x] No request field implies contextual personalization
- [x] Save/history/share/notes flows work with local persistence
- [x] Fallback content is clearly labeled as local collection content
- [x] README and architecture docs explicitly describe random-source behavior and limitations
- [x] No console errors on `/`
- [x] `lint`, `typecheck`, `test`, `test:e2e`, `build`, `docs:check`, and `audit:high` all pass

## Verification Log
- `pnpm install` (pass; lockfile synced and removed `@tanstack/react-query`)
- `pnpm run lint` (pass)
- `pnpm run typecheck` (pass)
- `pnpm run test` (pass)
- `pnpm run build` (pass; webpack mode)
- `pnpm run test:e2e` (pass)
- `pnpm run docs:check` (pass)
- `pnpm run audit:high` (pass)
- `pnpm run check` (pass)
- Chrome DevTools MCP production QA on `http://127.0.0.1:3100`:
  - `/` console clean and source disclosure verified
  - real quote draw from ZenQuotes verified
  - save note -> share flow verified with note hidden by default
  - `/saved` and `/history` route sanity verified with no console messages
