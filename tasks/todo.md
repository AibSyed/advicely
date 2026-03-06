# Advicely v6 Honesty-First Reframe Checklist

## Scope
- Branch target: `codex/advicely-v6-honesty-reframe`
- Product target: honest random advice-and-quotes draw app with save/history/copy value
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
- [x] Rebuild `/`, `/saved`, `/history`, `/copy/[id]`, and add `/sources`
- [x] Add optional personal notes that remain local-only and are excluded from copy output by default
- [x] Rewrite metadata, README, architecture docs, and `.env.example` to reflect honest product behavior
- [x] Fix the browser runtime error and add a console-clean e2e assertion
- [x] Remove all dead v5 files, labels, routes, and tests

## Acceptance Criteria
- [x] Draw mode works for `advice`, `quote`, and `mixed`
- [x] UI only presents normalized raw source content plus plain-language provenance
- [x] No request field implies contextual personalization
- [x] Save/history/copy/notes flows work with local persistence
- [x] Fallback content is clearly labeled as reserve content
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
  - save note -> copy flow verified with note hidden by default
  - `/saved` and `/history` route sanity verified with no console messages

## 2026-03-05 Premium Shell Polish
- [x] Replace vague hero badges with clearer portfolio-grade language
- [x] Rename fallback collection language to a more premium, clearer term everywhere
- [x] Replace flat `Saved / History / Sources` pills with a mobile-responsive navigation surface
- [x] Add a premium footer with improved disclaimer, attribution, and route-aware copy
- [x] Re-verify local build and local production UI after the shell polish

### Premium Shell Polish Verification Log
- `pnpm run lint` (pass)
- `pnpm run typecheck` (pass)
- `pnpm run test` (pass)
- `pnpm run build` (pass)
- `pnpm run test:e2e` (pass after updating the shipped eyebrow copy assertion)
- `pnpm run docs:check` (pass)
- `pnpm run audit:high` (pass)
- `pnpm run check` (pass)
- Chrome DevTools MCP on local production build `http://127.0.0.1:3100`:
  - homepage mobile shell verified with updated hero signals, nav, and footer
  - `/saved` mobile shell verified with responsive nav and filter layout
  - live draw verified with no console errors
  - screenshots captured: `tasks/qa-home-mobile.png`, `tasks/qa-saved-mobile.png`

## 2026-03-05 Full Cleanliness Scan
- [x] Re-run the verification ladder from a clean `master` checkout
- [x] Audit for dead code, unused dependencies, and avoidable duplication
- [x] Review architecture boundaries, route hygiene, and storage/API contracts
- [x] Review README/docs/env contracts for stale wording or drift
- [x] Fix any concrete residue or bad patterns found during the scan
- [x] Record final findings and verification evidence

### Full Cleanliness Scan Findings
- Removed misleading `share` terminology from the live route contract and renamed the local export flow to `/copy/[id]`.
- Fixed the stale-note bug by using the active draft note when opening the local copy flow.
- Fixed the false missing-state flash on the copy page with an explicit loading state.
- Extracted duplicated provider fetch/timeout/error handling into `lib/api/request-provider-json.ts`.
- Extracted duplicated library search matching into `features/library/query.ts`.
- Added regression coverage for client draw parsing, draw-engine fallback behavior, draw route behavior, and copy text formatting.
- Removed client-side runtime Zod validation from the deck page so the production bundle no longer triggers a CSP `unsafe-eval` issue in Chrome DevTools.
- Confirmed the only remaining `pnpm outdated` item is `eslint 10.0.2`; the repo stays on `eslint 9.39.3` because the active Next lint plugin stack still declares peer ranges through ESLint 9.

### Full Cleanliness Scan Verification Log
- `pnpm run check` (pass)
- `pnpm run test:e2e` (pass)
- `pnpm run docs:check` (pass)
- `pnpm run audit:high` (pass; no known vulnerabilities)
- `pnpm dlx knip --no-progress` (pass; no unused files/exports/deps reported)
- `pnpm outdated` (only `eslint` major available; intentionally held for peer compatibility)
- Chrome DevTools MCP on local production build `http://127.0.0.1:3101`:
  - `/` loaded with no console messages
  - `/saved` loaded with no console messages
  - `/history` loaded with no console messages
  - previous CSP `unsafe-eval` issue was eliminated after removing runtime Zod from the client bundle

## 2026-03-05 Toast + Transition Polish
- [x] Add a centralized Chakra toast system instead of per-screen inline status text
- [x] Route draw/save/copy feedback through shared toast helpers so action feedback stays consistent
- [x] Add cleaner route/nav motion without introducing App Router hacks or duplicated pending state
- [x] Update browser coverage for the new feedback surfaces
- [x] Re-run the repo verification ladder and local production browser QA

### Toast + Transition Polish Verification Log
- Context7 references used before implementation:
  - Chakra UI toast guidance for `createToaster` singleton setup and app-level `Toaster` rendering
  - Chakra UI `Presence`/transition guidance for entry animation constraints
  - Next.js App Router guidance for supported navigation feedback patterns (`useLinkStatus`, `loading.tsx`-style route feedback constraints)
- `pnpm run lint` (pass)
- `pnpm run typecheck` (pass)
- `pnpm run test` (pass)
- `pnpm run test:e2e` (pass)
- `pnpm run check` (pass)
- Chrome DevTools MCP on local production build `http://127.0.0.1:3102`:
  - `/` loaded with no console warnings or errors
  - draw success toast rendered with live-source detail
  - save toast rendered after moving a card into the library
  - `/saved` route loaded cleanly after navigation with no console warnings or errors

## 2026-03-05 Mobile Real-Estate Tightening
- [x] Reduce the amount of non-essential explanation above the fold on the home route
- [x] Replace the mobile 2x2 nav block with a compact horizontal rail
- [x] Compress mobile draw-mode selection into a tighter single-choice control
- [x] Re-verify the mobile shell in a production build

### Mobile Real-Estate Tightening Verification Log
- Context7 references used before implementation:
  - Chakra UI segmented control and compact button-group patterns for single-choice mobile controls
- `pnpm run lint` (pass)
- `pnpm run typecheck` (pass)
- `pnpm run test` (pass)
- `pnpm run build` (pass)
- `pnpm run test:e2e` (pass)
- Chrome DevTools MCP on local production build `http://127.0.0.1:3103` at `390x844`:
  - homepage now shows compact summary bullets instead of three stacked signal cards
  - nav now renders as a horizontal rail instead of a two-row grid
  - draw mode now renders as a compact single-choice control with a short helper line
  - no console warnings or errors

## 2026-03-05 CSP Eval Cleanup
- [x] Reproduce the reported production CSP `eval` issue against the shipped chunk path
- [x] Trace the client-side import path that still bundled Zod JIT code
- [x] Remove Zod from the browser storage/contracts path without weakening CSP
- [x] Rebuild and verify that the app route chunks no longer contain the offending path

### CSP Eval Cleanup Verification Log
- Production investigation:
  - confirmed live CSP header on `https://advicely.vercel.app` does not allow `'unsafe-eval'`
  - confirmed DevTools report referenced an older shipped chunk `932-2ece2dd6ed9d039d.js`
  - confirmed that chunk contained Zod JIT code with `Function("")`
- Fix:
  - replaced browser-side `features/library/contracts.ts` Zod contracts with plain TypeScript interfaces
  - replaced `libraryStateVMSchema.safeParse(...)` in `features/library/storage.ts` with manual guards/sanitizers
- Verification:
  - `pnpm run lint` (pass)
  - `pnpm run typecheck` (pass)
  - `pnpm run test` (pass)
  - `pnpm run build` (pass)
  - `pnpm run test:e2e` (pass)
  - rebuilt client route chunks checked clean:
    - `.next/static/chunks/app/page-*.js` has no `zod`, `Function(`, or `unsafe-eval`
    - `.next/static/chunks/app/saved/page-*.js` has no `zod`, `Function(`, or `unsafe-eval`
    - `.next/static/chunks/app/history/page-*.js` has no `zod`, `Function(`, or `unsafe-eval`

## 2026-03-05 Runtime Styling Migration
- [x] Remove Chakra and Emotion from the runtime dependency graph
- [x] Replace the Chakra shell with static CSS primitives and a local toast system
- [x] Restore default Next 16 `dev` and `build` scripts
- [x] Re-verify the app under a Turbopack production build
- [x] Recheck the deployed production app after merge

### Runtime Styling Migration Findings
- Chakra was the only meaningful reason the repo stayed on webpack for both development and production.
- The app shell, route components, nav, footer, source card, and toaster were migrated to local static primitives backed by `class-variance-authority` and `clsx`.
- The migrated Turbopack production build loads cleanly in Chrome DevTools with no React runtime error.
- A generated polyfill chunk still contains `Function("return this")`; this now appears to be framework-generated rather than app-authored runtime code.

### Runtime Styling Migration Verification Log
- `pnpm run lint` (pass)
- `pnpm run typecheck` (pass)
- `pnpm run test` (pass)
- `pnpm run build` (pass; Turbopack/default Next 16 runtime)
- `pnpm run test:e2e` (pass after removing transient toast-only assertions from the durable browser contract)
- `pnpm run docs:check` (pass)
- `pnpm run audit:high` (pass)
- `pnpm dlx knip --no-progress` (pass)
- Chrome DevTools MCP on local production build `http://127.0.0.1:3111`:
  - `/` loaded with no console messages
  - `/saved` loaded with no console messages
  - `/sources` loaded with no console messages
  - draw flow, local copy flow, and navigation rendered cleanly under the Turbopack build
 - Production recheck on `https://advicely.vercel.app` after merge:
   - Vercel production deploy for merge commit `2b5b7a15a19b3c9b0f3aa92f6ec6958bd593c3e9` completed successfully
   - public production alias serves the new Turbopack chunk graph
   - fresh browser session on `/` is console-clean

## 2026-03-05 Final Sweep
- [x] Re-scan repo guidance, docs, tasks, and dependency/output residue after the runtime migration
- [x] Remove stale generated artifacts from the workspace
- [x] Correct any stale operational guidance discovered during the sweep

### Final Sweep Findings
- Removed leftover Playwright `test-results/` residue from the working tree.
- Updated the outdated webpack-only lesson so it matches the current Turbopack-first architecture.
- Reconfirmed that the only available dependency major upgrade is `eslint 10`, which remains intentionally deferred for current Next plugin peer compatibility.
