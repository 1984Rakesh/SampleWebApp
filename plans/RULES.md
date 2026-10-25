# Shared Rules

Applies to every plan in `plans/`. The Manager (Claude) owns this file; Devin reads it at the start of every task.

## Stack
- **client/** — React 19, Vite 8, TypeScript 6, Tailwind CSS v4, vendored shadcn/ui (radix-ui, lucide-react), TanStack Query, Axios, Zod, React Router 7. Lint: oxlint. Tests: Node test runner + Vite SSR (`client/tests/*.test.mjs`).
- **server/** — Express 5, better-sqlite3, bcrypt, jsonwebtoken, Zod, TypeScript 7 (no JS compiler API). Tests: tsx + Node test runner (`server/tests/*.test.ts`), compiled startup smoke test.
- No root package.json. Each side installs and verifies on its own.
- New dependencies: pick versions published at least 7 days ago; never bypass security configuration.

## Architecture
The authoritative rules are in the repo:
- Root: `AGENTS.md`, `.devin/rules/clean-architecture.md`
- Client: `client/AGENTS.md`, `client/.devin/rules/client-architecture.md`
- Server: `server/AGENTS.md`, `server/.devin/rules/server-architecture.md`

Read the shared files and the side you touch before every task. Summary:
```
Building blocks: Foundation → Features → App
Imports:         App → Features / Foundation
Inside feature:  Presentation → Domain ← Data (client) / Infrastructure (server)
```
- Domains are pure TypeScript: only own domain + `shared/domain`.
- Features never import App or sibling features; cross-feature needs are consumer-owned contracts injected by App.
- Vendored shadcn primitives, radix-ui, lucide-react and Tailwind class composition live only in `client/src/components/ui/` and `client/src/components/app/`.
- **Enforcement:** dependency-cruiser, per side (`client/.dependency-cruiser.cjs`, `server/.dependency-cruiser.cjs`), run with `npm run check:architecture`. All rules are `error`. Rules the tool can't check (prop leakage, ViewState vs entity rendering, tri-state patches, error translation) stay manual review items.
- Fix existing violations inside your task's scope only; never weaken or `ignore` a dependency-cruiser rule to make a check pass. Raise it as a blocker instead.

## Branching & PRs
- Feature branch: `feat/<feature-slug>`, created from `main` when the plan is approved. The plan file lives on it.
- Task branch: `task/<feature-slug>/<id>` (id lowercased, dots to dashes, e.g. `p1-t3`), from the latest feature branch; PR targets the feature branch.
- Fix-up branch: `task/<feature-slug>/<id>a` from the parent task branch; PR targets the parent task branch (stacked PR).
- PR title: `<TaskID>: <task title>`. PR body: what changed, verification output, notes.
- Squash-merge every task and fix-up PR. Never merge a parent PR while a child (fix-up) PR on it is open.
- One open task per feature at a time.
- Only the user merges into `main`. Nobody force-pushes.
- After CI exists, no PR merges without green CI.

## Verify commands
Run for every side you modify, and paste the results into the PR:
```bash
# Client
cd client && npm ci && npm test && npm run build && npm run lint && npm run check:architecture

# Server
cd server && npm ci && npm run build && npm test && npm run test:startup && npm run check:architecture

# Repository
git diff --check
```
`check:architecture` exists only once plan `dependency-cruiser` P1 has merged; skip it before then. If a client DTO/mapper moves, also run the server suite, because `server/tests/client-contract.test.ts` imports client code.

## Task types
- **setup**: tooling, CI, config, docs. No behaviour or visual change to the app.
- **refactor**: move or restructure code. No change to behaviour, visuals, public API, browser routes, DB schema or stored-session format. Existing tests pass without changing their assertions; only import paths may change.
- **ui**: visual/markup changes only. No logic, data-flow or API changes.
- **test**: add or adjust tests only.
- **fix**: resolve review findings listed in the task; nothing else.
- Never mix refactor and ui in one task.

## Ledger rules
- **Worker (Devin):** in the plan file, edit only your own task: status `[~]`→`[r]` (or `[!]` + a Blockers line), the PR field, and dated Notes. Never set `[x]`, never edit other tasks, structure, Decisions or this file.
- **Manager (Claude):** sets `[x]` after merge, adds or changes tasks, Decisions, Open Questions and the Change Log; owns this file.
