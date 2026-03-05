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
- Prevention rule: Keep `next dev --webpack` for this repo and verify browser console is clean via DevTools before finalizing UI work.

## 2026-03-04
- What went wrong: Advice cards surfaced non-practical quote content and generic warning labels that confused normal users.
- Root cause: Provider acceptance heuristics overvalued grammar/length and shaping rules added context-agnostic blocks for deep mode.
- Prevention rule: Require practical-language heuristics plus context relevance before accepting provider text, and enforce intent-specific block assertions in unit tests.
