# Engineering Review Notes

## Architecture Review
- Clear separation between UI (`app/`, `components/`), domain contracts (`features/`), and provider adapters (`lib/api`).
- Route handlers isolate external API I/O from presentation components.
- TanStack Query provider centralizes server-state behavior and retry/staleness policy.

## Code Quality Review
- Removed legacy CRA patterns and class-component state handling.
- Replaced untyped payload handling with Zod schema gates.
- Added explicit fallback behavior for provider outages to avoid runtime crashes.

## Test Review
- Unit tests cover schema acceptance and invalid payload rejection paths.
- Playwright e2e covers primary hero + interaction surface for each app.
- CI enforces lint, typecheck, unit tests, and build before merge.

## Performance Review
- Default server rendering with targeted client components.
- Query staleness budgets configured to reduce unnecessary refetch loops.
- External calls bounded via timeout/retry strategy and fallback datasets.
