# Lessons Learned

## 2026-03-04
- What went wrong: The prior rewrite drifted away from the original one-click advice identity and felt too generic.
- Root cause: Product intent was translated into broad coaching patterns without preserving the core instant-advice loop as the dominant interaction.
- Prevention rule: For each product rewrite, lock the primary loop in tests and README first, then reject any UI changes that demote that loop from first-screen focus.

## 2026-03-04
- What went wrong: User-facing copy exposed internal system language and game-like framing that confused normal users.
- Root cause: Internal confidence/source/error concepts were surfaced directly in UI text instead of being translated into plain-language guidance.
- Prevention rule: Any surface copy touching API diagnostics must pass a plain-language review and include an e2e assertion that technical labels are not shown to end users.

## 2026-03-04
- What went wrong: Verification briefly showed a false lint failure.
- Root cause: Lint and Playwright were run in parallel, and Playwright rotated `test-results` during ESLint file walking.
- Prevention rule: Run lint/typecheck/test/e2e/build sequentially for final evidence to avoid filesystem race conditions.

## 2026-03-04
- What went wrong: Dev runtime produced a Chakra hydration mismatch after switching to Turbopack mode.
- Root cause: Emotion style injection order in this stack can diverge under Turbopack dev hydration.
- Prevention rule: If a styling/runtime stack fights the platform defaults, re-evaluate the primitive layer instead of pinning the whole repo to a fallback bundler, then verify the production build in DevTools before finalizing UI work.

## 2026-03-04
- What went wrong: Advice cards surfaced non-practical quote content and generic warning labels that confused normal users.
- Root cause: Provider acceptance heuristics overvalued grammar/length and shaping rules added context-agnostic blocks for deep mode.
- Prevention rule: Require practical-language heuristics plus context relevance before accepting provider text, and enforce intent-specific block assertions in unit tests.

## 2026-03-05
- What went wrong: The product was framed as tailored practical advice even though the live providers only return random advice and quotes.
- Root cause: The rewrite treated local shaping as product value and let UI copy overstate what the source data could honestly support.
- Prevention rule: For source-driven products, verify live upstream payloads first, lock truthful provenance copy in the primary UI and README, and forbid fabricated semantic sections unless they are explicitly labeled as app-authored.

## 2026-03-05
- What went wrong: The live v6 UI still shipped placeholder badge copy, weak fallback naming, and a flat mobile nav that did not feel portfolio-grade.
- Root cause: The honesty-first rewrite fixed product truth first, but the final shell polish was not treated as its own required pass across copy, navigation, and footer behavior.
- Prevention rule: After a structural rewrite, run a separate deployed-shell polish pass for badge copy, fallback naming, mobile navigation, and footer quality before calling the UI finished.

## 2026-03-05
- What went wrong: The shell polish changed visible copy, but Playwright still asserted the previous eyebrow text and failed late in verification.
- Root cause: UI copy changes were finalized before the e2e expectations were reconciled against the shipped wording.
- Prevention rule: When surface copy changes, update the browser specs in the same patch and rerun the affected flow before moving on to broader verification.

## 2026-03-05
- What went wrong: The honesty-first rewrite still kept “share” naming in routes, storage, and docs even after the product had become a local copy flow.
- Root cause: Semantic cleanup stopped at the visible UI layer instead of tracing the concept through route contracts, persistence, and task documentation.
- Prevention rule: When a product term changes, run a repo-wide terminology sweep across routes, storage contracts, docs, and tests before final verification.

## 2026-03-05
- What went wrong: The homepage and supporting copy started explaining internal product constraints instead of leading with user value.
- Root cause: Internal alignment language from the honesty-first rewrite leaked into hero and footer copy without a separate plain-language value pass.
- Prevention rule: For any marketing-facing surface, keep the headline and subhead focused on what the user gets in one sentence, then push trust or implementation details into secondary copy.

## 2026-03-05
- What went wrong: The page metadata kept older internal-facing product wording after the visible homepage copy had already been simplified.
- Root cause: Metadata was treated as technical setup instead of part of the same user-facing copy surface as the hero and social preview text.
- Prevention rule: Whenever headline copy changes, update `Metadata`, Open Graph, and Twitter text in the same patch and verify the rendered title on production.

## 2026-03-05
- What went wrong: Final verification briefly produced another false lint failure during the toast and transition pass.
- Root cause: `check` and Playwright were launched in parallel again, and Playwright rotated `test-results` while ESLint was traversing the repo.
- Prevention rule: For Advicely final evidence, run `check` first and `test:e2e` second in separate commands, never in the same parallel batch.

## 2026-03-05
- What went wrong: Production CSP still reported a blocked `eval` path even after earlier client-side Zod cleanup.
- Root cause: The browser-side library storage module still imported Zod-backed contract modules, which shipped Zod's JIT `Function(...)` path into the client bundle.
- Prevention rule: Keep browser storage and client guards on plain TypeScript/manual validation only; any Zod schema module imported by a client file must be treated as a bundle leak and removed from that path.

## 2026-03-05
- What went wrong: The repo kept a Chakra/webpack runtime workaround in scripts and docs after the actual blocker had become CSP cleanliness rather than product UI capability.
- Root cause: We optimized around the old styling runtime instead of reevaluating whether a static primitive layer would better fit Next 16 and strict CSP.
- Prevention rule: When a framework workaround becomes the main source of platform friction, reevaluate the primitive layer itself and update docs/scripts in the same migration.

## 2026-03-05
- What went wrong: Browser specs asserted toast copy that was too transient to be a stable end-to-end contract.
- Root cause: A visual feedback detail was tested as durable page content instead of as a best-effort transient affordance.
- Prevention rule: In e2e coverage, assert durable outcomes first and only assert transient toast copy when the timing is explicitly stabilized.

## 2026-03-06
- What went wrong: Homepage signal icons and footer information cards shipped with inconsistent visual alignment and low-contrast badge treatment in dark surfaces.
- Root cause: Shared flex utility composition and panel spacing assumptions leaked into specialized sections without a dedicated contrast/layout QA pass.
- Prevention rule: For every homepage/footer change, run a targeted UI audit for icon baseline alignment, explicit container layout (`display` + `gap`), and WCAG AA contrast thresholds before final verification.

## 2026-03-06
- What went wrong: Social media assets were prepared from manual viewport screenshots, which introduced framing artifacts and inconsistent crop quality.
- Root cause: We treated portfolio image export as a visual task only instead of using metadata-native Open Graph assets as the canonical source.
- Prevention rule: For share previews, always update and verify `app/opengraph-image.tsx` plus metadata image tags first, then generate any portfolio exports from those OG endpoints.
