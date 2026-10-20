---
name: clean-architecture-mui-to-shadcn-migration
description: Use this skill to migrate the Clean Architecture tasks app (or any screen of it) from MUI to Tailwind CSS v4 + shadcn/ui using this design system, and to update already-migrated code when the design system changes. Covers setup, token wiring, component mapping, screen-by-screen conversion, dark mode, verification and cleanup.
user-invocable: true
---

# MUI → Tailwind v4 + shadcn/ui migration

Source of truth: the design system bundled in `design-system/`. Paths below (`tokens/`, `shadcn/`, `components/`, `ui_kits/`) are relative to that folder; `src/` paths are in the target repo. Read `design-system/readme.md` first, then `mapping.md` (component + prop + token map) and `checklist.md` (per-screen done criteria) in this folder.

## Modes
- **Migrate** — the target codebase still uses `@mui/*`. Follow all phases.
- **Update** — the codebase is already on shadcn and the design system changed. Skip to Phase 5: diff `tokens/*.css`, `shadcn/globals.css` and `components/**` against the codebase copies and apply only the changes.

If the user hasn't said which, check `package.json` for `@mui/material`.

## Phase 0 — Audit (no code changes)
1. List every file importing `@mui/material`, `@mui/icons-material`, `@mui/lab`, `@emotion/*`, `makeStyles`, `styled(`, `sx=`, `ThemeProvider`, `useTheme`, `createTheme`.
2. Group by screen: Dashboard, Tasks, Task dialog (new/edit), Profile, Sign in, Create account, shared layout/header.
3. Note any MUI component not in `mapping.md` and ask the user before inventing a replacement.
4. Report the inventory and the planned order (shared layout → primitives in use → screens, smallest first). Wait for a go-ahead if the change set is large (>15 files).

## Phase 1 — Install & configure
1. `npm i -D tailwindcss @tailwindcss/vite` (or `@tailwindcss/postcss`), add the plugin.
2. `npx shadcn@latest init` → new-york, CSS variables on, base color neutral. Use `shadcn/components.json` from this DS as reference (adjust `tailwind.css` path and `rsc`/`tsx` to the project).
3. `npx shadcn@latest add button badge card input textarea label checkbox select tabs dialog progress table avatar separator`.
4. Replace the generated `globals.css` with `shadcn/globals.css`; copy `tokens/colors.css`, `tokens/radius.css`, `tokens/fonts.css` beside it (keep the `@import` order in `globals.css`).
5. Fonts: prefer `@fontsource-variable/bricolage-grotesque` + `@fontsource/dm-sans` over the Google Fonts import in `fonts.css`.
6. `npm i lucide-react clsx tailwind-merge` (shadcn init usually adds the last two).
7. Patch the shadcn-generated `card.tsx` and `dialog.tsx`: add `font-heading tracking-tight` to `CardTitle` / `DialogTitle` (the only deliberate deviations from upstream).

Keep MUI installed until Phase 6 so unmigrated screens still run.

## Phase 2 — Theme switch
- Remove `ThemeProvider`/`CssBaseline`/`createTheme` only after every screen is migrated; until then wrap only unmigrated routes.
- Dark mode = `.dark` class on `<html>`. Persist `'light' | 'dark' | 'system'` in `localStorage['color-mode']`; for `system` follow `matchMedia('(prefers-color-scheme: dark)')`.
- Add an inline script in `index.html` `<head>` that applies `.dark` before first paint to avoid a flash.
- Replace any `data-theme` attribute, `theme.palette.mode` checks or `useMediaQuery(theme.breakpoints…)` with the class + Tailwind breakpoints (`sm md lg`).

## Phase 3 — App blocks
Port `components/app/*` into `src/components/app/` as `.tsx`:
- `Icon name="plus"` → `<Plus className="size-4" />` from `lucide-react` (names in readme ICONOGRAPHY).
- `cn` import → `@/lib/utils`.
- Keep props from the `.d.ts` files as the TS interfaces.
Order: Logo → TaskBadge → TaskProgress → StatCard → TaskRow → TaskTable → AppHeader.

## Phase 4 — Screens
For each screen, one at a time:
1. Open the matching recreation in `ui_kits/tasks-app/` (`Dashboard`, `Tasks`, `Profile`, `NewTaskDialog`, `SignIn`, `CreateAccount`) — it is the visual target.
2. Rewrite JSX with `mapping.md`. Keep business logic, hooks, data fetching, routing and test ids untouched; only presentation changes.
3. Convert every `sx`/`styled`/`makeStyles` rule to utilities using the token map. No hex values, no arbitrary colors (`bg-[#...]`); use roles (`bg-card`, `text-muted-foreground`, `bg-status-done`…).
4. Copy follows readme CONTENT FUNDAMENTALS (sentence case, no exclamation marks). Don't rewrite existing product copy unless it breaks those rules — flag it instead.
5. Run `checklist.md` for the screen in light and dark. Commit per screen.

## Phase 5 — Update (design system changed)
1. Diff `tokens/colors.css`, `radius.css`, `fonts.css`, `shadcn/globals.css` → apply verbatim (they're designed to be copied).
2. Diff `components/app/*.jsx` against the project's `.tsx` ports; apply changes, re-applying the lucide/TS conversions.
3. For `components/ui/*`, prefer `npx shadcn@latest add <name> --overwrite` then re-apply the `font-heading tracking-tight` patch; only hand-port if the DS changed a class recipe (check its `.prompt.md`).
4. Grep for removed/renamed tokens and fix call sites.
5. Re-run `checklist.md` on affected screens.

## Phase 6 — Cleanup
- `npm rm @mui/material @mui/icons-material @mui/lab @emotion/react @emotion/styled` (and `@mui/x-*` if unused).
- Grep must return nothing for: `@mui/`, `@emotion/`, `sx=`, `makeStyles`, `createTheme`, `--bg-paper`, `data-theme`.
- Delete the old theme file(s). Typecheck, lint, test, build.

## Rules
- Never change behaviour while migrating; presentation only.
- One screen per PR/commit; keep the app runnable between steps.
- Unknown component or ambiguous visual → ask, don't invent.
- Report at the end: files changed, MUI components removed, anything flagged.
