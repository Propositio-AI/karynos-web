# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See README.md for project overview/setup; this file covers architecture, workflows, and gotchas.

## Dev Commands

- `npm run dev` — start dev server (Turbopack), port 3000. Or `make up` (Docker).
- `npm run lint` / `npm run lint:fix` — ESLint (`next lint`).
- `npm run prettier` — Prettier write (no separate `format:check`/`format` script exists, see CI gotcha below).
- `npm run build` — runs `prebuild` (API compat check + orval codegen) then `next build`. **Requires the backend running** at `NEXT_PUBLIC_API_BASE_URL`/`OPENAPI_URL` (default `http://localhost:8000`) — build fails otherwise.
- `npm run orval` / `npm run orval:watch` — regenerate the API client from the backend's OpenAPI spec without a full build.
- `npm run storybook` / `npm run build-storybook` — Storybook on port 6006.
- No test suite is wired up: `vitest` and `playwright` are devDependencies but have no config or test files. Don't assume `npm test` exists.

## Architecture

- App Router pages are thin: `page.tsx` Server Components wrap a `*PageContent.tsx` Client Component that holds all logic. There is no server-side data prefetching — fetching happens client-side via `useEffect` inside feature hooks.
- State management: no global store or cache library (no Redux/Zustand/TanStack Query/SWR). State lives in feature-scoped hooks under `src/hooks/features/`, each returning `{ data, loading, error }` plus manual `refresh`/`refetch`.
- Chat uses SSE streaming with optimistic UI updates.
- Auth: AWS Cognito via Amplify v6, passwordless `EMAIL_OTP` flow. JWT is attached to outgoing requests by the axios interceptor in `src/lib/api/mutator.ts`. There is **no route middleware/guards** — authorization is enforced entirely by the backend; this is a known gap, not an oversight to "fix" casually.
- Routes live under `src/app/(routes)/`; dynamic segments include `[conversation_id]`, `[job_id]`, `[dreamer_id]`, `[group_id]`. Mentor/admin views are under `/mentor/`. Note: `/` is currently a component-demo page, not the real homepage.

### Component conventions

- `features/` subfolders must never import from each other.
- `ui/` components must contain no business logic.
- One-way dependency direction: atoms → molecules → templates (never reverse).
- `'use client'` is mandatory for any interactive component.
- PascalCase filenames for components.
- Tailwind v4 utility-first; no CSS Modules or styled-components; custom classes only in `globals.css`. Common patterns: `border-zinc-200`, `rounded-lg` for cards/buttons, `rounded-full` for nav, `text-red-600` for errors; prefer `Container`'s `space` prop over margin utilities.
- Icon usage is inconsistent across the codebase (Font Awesome, React Icons, Lucide are all present) — match whatever the surrounding file already uses rather than introducing a fourth.

### Formatting

`.prettierrc.json` uses **tabs, not spaces** (`useTabs: true`, `tabWidth: 4`), `printWidth: 100`, double quotes off (`singleQuote: false` → double quotes), trailing commas everywhere. `.eslintrc.json` extends `next/core-web-vitals`, `next/typescript`, `prettier`, and disables `@typescript-eslint/no-explicit-any`; it ignores `.next/`, `node_modules/`, `storybook-static/`, `coverage/`, `src/app/gen/`.

## API client (Orval)

- `orval.config.ts` pulls the live OpenAPI spec from the backend (`OPENAPI_URL` or `${NEXT_PUBLIC_API_BASE_URL}/openapi.json`) and generates an axios client (tags-split mode) into `src/lib/api/gen/`, routed through the custom mutator at `src/lib/api/mutator.ts` (attaches the Cognito JWT). **Never hand-edit files under `src/lib/api/gen/`** — regenerate via `npm run orval` instead.
- `scripts/check-api-compat.mjs` runs automatically before every build (`prebuild`): it fetches the live remote OpenAPI spec, diffs it against the committed `openapi.json`, and exits 1 on breaking changes (removed paths/methods, new required params) or on network failure. If it passes, it overwrites the local `openapi.json`. Response-body shape changes aren't caught by this script — they only surface as TypeScript errors during `next build`.

## CI gotcha

`.github/workflows/code-quality.yml` runs `npm run format:check` and `npm run lint` on PRs/pushes to `main`/`develop`. **`format:check` does not exist in `package.json`** (only `prettier` does), so this workflow currently fails as written — be aware of this if asked to fix CI; the README also flags it and suggests adding `"format:check": "prettier --check ."`.

## Cursor / Copilot Rules

None present — no `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` exist in this repo.
