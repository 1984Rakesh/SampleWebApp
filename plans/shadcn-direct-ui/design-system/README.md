Use this system to build screens for the tasks app: React + Node, **Tailwind CSS v4 + shadcn/ui**. No MUI. It has a dark and a light theme with identical layout; only the colour variables change. Never write a hex value in a screen: use a utility that reads a token (`bg-card`, `text-muted-foreground`, `border-input`).

## Stack

- Tailwind CSS v4 (`@import "tailwindcss"`, `@theme inline`), Vite plugin `@tailwindcss/vite`.
- shadcn/ui components copied into `src/components/ui/` (Radix primitives), `cn()` from `@/lib/utils`, `class-variance-authority`, `lucide-react` icons.
- Theme variables live in `src/index.css` (see `shadcn/globals.css` in this system): light on `:root`, dark on `.dark`, as a stock shadcn install.
- Fonts: Bricolage Grotesque (`font-display`) for titles and numbers, DM Sans (`font-sans`) for everything else.

## Token names

Tokens use shadcn's names, so every shadcn component works unchanged: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-1..3`, each with its `-foreground` pair. The tasks app adds a few extensions the same way (`header`, `inset`, `divider`, `link`, `success`, `warning`, `check-ring`, `priority-*`, `status-*`, `overlay`). `radius-md` is shadcn's `--radius` (12px); the other radii, `shadow-card` and `shadow-dialog` are added in `@theme inline`.

## Consuming this system (Design canvas)

Bundle global: `window.TasksDS` (React 18, supplied by the page). Load `components/bundle.css` first (theme variables, compiled utilities and fonts), then `components/bundle.js`. Put `data-theme="dark"` or `data-theme="light"` on the root element of the screen; all `var(--background)`, `var(--card)` and similar tokens follow it. Mount components with `<x-import component-from-global-scope="TasksDS.Button">`. Index: Icon, Button, Badge, Checkbox, Field, ToggleGroup, Select, StatCard, TaskRow, TaskTableHead, TaskTableRow, AppHeader, Dialog. Read `components/<Comp>/README.md` for props. `bundle.css` is pre-compiled for the classes inside `bundle.js`; screens around the components use inline styles with the CSS variables, not new Tailwind classes.

## Content fundamentals

- Use sentence case and plain verbs: "New task", "Create task", "Mark as done", "View all". Buttons name the action, never "Submit" or "OK".
- Speak to the user in second person only where it helps ("Update your details"); otherwise state facts: "1 task is due today and 8 are still to do."
- Greet by time of day in the page title: "Good evening, Rakesh". The date eyebrow is uppercase `overline`.
- Priority words are High, Medium, Low. Status words are To do, In progress, Done. Always show the word; colour alone never carries meaning.
- Dates read "Today", "Tomorrow", "Wed, 21 Oct"; an empty due date is an em dash.
- No emoji, no exclamation marks, no filler counts: every number comes from the task list.

## Visual foundations

- Ground: `bg-background` behind everything, `bg-card` for cards, table, dialog and rows, `bg-header` for the app bar. Separate surfaces with a 1px `border`, not shadow; `shadow-card` exists only in the light theme.
- One accent: `primary`, with `primary-foreground` text on it. Use it for the default button per screen, the logo mark, the avatar and the focus ring. Links use `text-link`.
- Text: titles in `foreground`, everything secondary in `muted-foreground`. Page titles use `display-xl`, card titles `display-md`, dialog titles `display-lg`, stat numbers `stat`, all else the Text styles.
- Status and priority are tinted badges: the `priority-*` and `status-*` token pairs, fully rounded (`rounded-full`). Priority badges carry a 6px dot before the label; status badges do not.
- Done state: filled round checkbox (`bg-success`, `text-success-foreground` check), title struck through in `muted-foreground`.
- Radii: inputs, buttons and control containers `rounded-md`; stat cards `rounded-card`; content cards `rounded-xl`; dialog `rounded-2xl`; badges and nav pills `rounded-full`.
- Spacing: Tailwind's 4px scale. Sections 24px to 32px apart (`gap-6`, `gap-8`), card padding `p-5` to `p-7`, page content max 1200px (Profile 1000px) with `px-8` side padding.
- Focus: `focus-visible:ring-2 ring-ring ring-offset-2` on every interactive element. Inputs switch their border to `border-ring`.
- Layout: the header wraps on small screens, stat cards and columns stack, the table scrolls horizontally inside its card. Design for phone width as well as desktop.
- Motion: none beyond instant state changes.

## Iconography

Use `lucide-react` (shadcn's default), 1.8px stroke at 18px; 3.2px stroke for the check inside a checkbox; `currentColor`. The `Icon` component here draws the same shapes for documentation. Icon-only buttons always get an `aria-label`. No emoji, no icon fonts.

The logo mark is a 32px square with 10px corners in `bg-primary`, holding a check in `text-primary-foreground`; the app name is set in `brand`. There is no other brand artwork.

## Theming

Toggle the `dark` class on `<html>`. In the preview files of this system the same effect comes from `data-theme="dark|light"`. The user's choice (Light, Dark, System) is stored in `localStorage` and applied before first paint; the control is a `ToggleGroup`.

## Set up in a Vite + React + TypeScript app

1. `pnpm add tailwindcss @tailwindcss/vite` and `pnpm add -D @types/node`.
2. Replace the contents of `src/index.css` with `shadcn/globals.css` from this system.
3. Add the `@/*` path alias to `tsconfig.json` and `tsconfig.app.json` (`"baseUrl": "."`, `"paths": {"@/*": ["./src/*"]}`) and to `vite.config.ts` (`plugins: [react(), tailwindcss()]`, `resolve.alias["@"] = path.resolve(__dirname, "./src")`).
4. `pnpm dlx shadcn@latest init`, then keep the existing `src/index.css` variables when it asks (or merge: our file already defines them).
5. `pnpm dlx shadcn@latest add button badge checkbox input textarea label toggle-group card dialog select table dropdown-menu sonner`.
6. Add the `priority-*` and `status-*` variants to `badge.tsx`, the `destructive`, `default` (46px) and `icon` sizes to `button.tsx`, and make `checkbox.tsx` round, as the component guidelines describe.
7. Remove `@mui/*`, `@emotion/*`, the `ThemeProvider` and `CssBaseline` once each screen is migrated.

## MUI to shadcn map

Card, Paper to `Card`; Button to `Button`; Chip to `Badge`; TextField to `Label` + `Input`/`Textarea`; Tabs, ToggleButtonGroup to `ToggleGroup`; Dialog to `Dialog`; Table to `Table`; Select to `Select`; Snackbar to `sonner`; AppBar to the custom `AppHeader`.

## Known gaps

- The border of inputs and outline buttons (`input`) is about 1.3:1 in dark and 1.5:1 in light against its ground. State is carried by the `ring`, which passes 3:1. If strict control-border contrast is required, darken `input` to about `#8a94a8` in light.
- The Done checkbox in the light theme is white on `#3fa663` (3.1:1): acceptable for an icon, not for text. Always show the word "Done" beside it.
- Previews in this system use the Tailwind v3 Play CDN with the same utility names; the real app uses v4. Avoid opacity modifiers on token colours (`bg-primary/50`) in preview components.
- Theme persistence logic is not documented here, only the control.
