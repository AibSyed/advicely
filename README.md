# Advicely Coach

Advicely has been rebuilt into a guided coaching studio focused on daily behavior change through themed prompts and reflection loops.

## Stack
- Next.js 16 App Router
- React 19 + TypeScript strict mode
- TanStack Query v5
- Zod validation
- Tailwind CSS
- Vitest + Playwright

## Development
```bash
pnpm install
pnpm dev
```

## Verification
```bash
pnpm run check
pnpm run test:e2e
pnpm run audit:high
```

## Notes
- Live guidance attempts Advice Slip first.
- On provider failure, schema-validated curated coaching cards are served.
