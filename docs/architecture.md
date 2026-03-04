# Advicely Coach Architecture

- Runtime: Next.js App Router, React 19, strict TypeScript.
- Data: API route (`app/api/coaching`) + provider adapter (`lib/api/coaching-provider.ts`).
- Validation: Zod schema contracts in `features/coaching/schema.ts`.
- State/cache: TanStack Query with bounded retries.
- Security: strict response headers, CI audit gate, CodeQL.
