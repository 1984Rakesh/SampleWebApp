# Conventions: shadcn direct UI
Follows plans/RULES.md. Rules below apply to every task in this plan.

## Design source
- DS copy: `plans/shadcn-direct-ui/design-system/`. Read only what your task's **Read only** line names. The primitives in `client/src/components/ui/` already carry the DS classes; this repo uses **npm**. Never import or copy `bundle.js`.
- Don't open the old `Ui*` wrapper sources: each task's Manager notes say what the wrappers it replaces did.

## Styling
- No hex/rgb colours in `src` outside the theme CSS; use token utilities (`bg-card`, `text-muted-foreground`, `bg-priority-high`, `border-divider`, …). No opacity modifiers on token colours.
- Type: `font-display` for page/card/dialog titles and stat numbers, `font-sans` for the rest. No `display-*` utilities exist; use bracket classes: page title `font-display text-[42px] leading-[46px] font-bold tracking-tight`, dialog/auth-card title `text-[28px] leading-8`, card title `text-[22px] leading-7 tracking-tight` (on `CardTitle`, which adds `font-display font-semibold`).
- Radii: inputs/buttons `rounded-md`; stat cards `rounded-card`; content cards `rounded-xl`; dialog `rounded-2xl`; badges/pills `rounded-full`.
- Page: `<main className="min-h-screen bg-background px-4 py-4 md:px-8 md:pt-10 md:pb-16">` + `div.mx-auto w-full max-w-[1200px]` (Profile `max-w-[1000px]`); sections `gap-6`. Must work at 375px: stacking grids, horizontally scrolling tables.
- Copy: no emoji, no exclamation marks, sentence case. Priority/status always show the word.
- shadcn `Button` has no default `type`: inside a `<form>`, every non-submit button needs `type="button"`.
- Icon-only buttons have `aria-label`. Errors: `Alert variant="destructive"` + `OctagonX` + `AlertDescription`. Loading button: `Loader2 className="size-4 animate-spin" aria-hidden="true"` before the label.

## Architecture
- Import primitives, `cn` and `SelectOption` from the `components/ui` barrel, never from a file. Feature `presentation/screens|components`, `components/layout|feedback` and `src/app/` may import the barrel, `lucide-react` and `cn`; domain, data, foundation, shared, models and ViewModels may not.
- Screens/components render ViewState and primitives only; ViewModels, hooks, handlers, routes, test ids and API/session contracts don't change.
- Task UI stays in `tasks/presentation/components`; the dashboard uses its own contracts plus `components/app` (StatCard, ChecklistRow). No new cross-feature imports. A new file must be imported in the same task (no-orphans).
- Don't run the shadcn CLI; edit `components/ui` files directly (relative imports inside it, no `"use client"`).

## Ui* → shadcn mapping
- Layout wrappers (`UiFlex`, `UiStack`, `UiGrid*`, `UiPage`, `UiScreen`, `UiContainer`, `UiAsideGrid`, `UiResponsive`) → `div`/`section`/`main` + Tailwind. `UiText` → `h1`–`h3`/`p`/`span` + type classes.
- `UiCard*`/`UiPaper`/`UiTonePanel` → `Card*`; `UiButton`/`UiIconButton`/`UiLink` → `Button` (`asChild` around router links); `UiTextField` → `Label` + `Input`/`Textarea` (+ `aria-invalid`, `aria-describedby`, error `p.text-sm text-destructive`).
- `UiSelect` → `Select*`; `UiToggleGroup`/`UiTabs` → `ToggleGroup`; `UiCheckbox` → `Checkbox`; `UiChip` → `Badge`; `UiAlert` → `Alert`; `UiDialog` → `Dialog*`; `UiTable*` → `Table*`; `UiAvatar` → `Avatar`; `UiDivider` → `Separator`; `UiProgress` → `Progress`; `UiIcon` → lucide; `UiSnackbar`/`UiToastHost` → `sonner`; `UiSwatch`/`UiList`/`UiFormFooter` → plain markup.
- Radix quirks: `Select` rejects `""` values and a single `ToggleGroup` sends `""` on re-click; use an `all` sentinel and ignore empty values.
- `Ui*` types in models become feature-owned string unions in the same models file.
