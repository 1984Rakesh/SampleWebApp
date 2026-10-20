# Clean Architecture Tasks — Design System

Design system for **Clean Architecture**, a personal tasks app (React front end, Node back end, clean-architecture layering). It is built on **Tailwind CSS v4 + shadcn/ui** (new-york style): shadcn color roles as CSS variables, shadcn component APIs and class recipes, plus app blocks composed from them. Two themes: **light** (white surfaces, indigo #4655D4 primary) and **dark** (deep ink, periwinkle #8C9EFF primary). Theme choice is Light / Dark / System, persisted under `localStorage['color-mode']`, applied as the `.dark` class on `<html>`.

One product surface: the **tasks web app** — Dashboard, Tasks, New/Edit task dialog, Profile (plus a "Comparison" nav item the spec does not define).

## Migration note (MUI → Tailwind + shadcn/ui)
- Earlier versions mirrored an MUI theme (`--bg-paper`, `TextField`, `Chip`, `data-theme`). Those are gone. Mapping: `TextField` → `Label` + `Input`/`Textarea`; `Chip` → `Badge` / `TaskBadge`; `IconButton` → `Button size="icon"`; `SegmentedControl` → `Tabs` (list only); `ProgressBar` → `Progress` / `TaskProgress`; `NavPill`/`UserPill` → ghost/outline `Button` inside `AppHeader`; `Dialog title/actions` props → `DialogHeader`/`DialogFooter` composition.
- Visuals lean toward shadcn defaults (h-9 controls, rounded-md/xl, text-sm, shadow-xs/sm) while keeping the brand palette, fonts and status colors.

## Sources
- `uploads/design-spec (1).md` — original redesign spec (light + dark, MUI-based). Palette, copy and screen structure come from it.
- `uploads/Tasks App Redesign.pdf` — four dark reference screens; copies in `assets/reference/`.

## Index
- `styles.css` — entry (imports only) → `tokens/fonts.css`, `colors.css` (`:root` + `.dark`), `radius.css`, `base.css`
- `tw-preview.js` — preview-only Tailwind v4 browser runtime + the `@theme inline` mapping. Every card, the kit and the template load it after `styles.css`.
- `shadcn/globals.css`, `shadcn/components.json` — production setup for a real Tailwind build
- `components/ui/` — shadcn primitives; `components/app/` — app blocks; one or more cards per folder
- `ui_kits/tasks-app/` — interactive recreation (`index.html`)
- `templates/tasks-dashboard/` — Dashboard starting template
- `guidelines/` — foundation cards; `assets/reference/` — screenshots

## Components
**ui/** (shadcn API, `data-slot` attributes, `className` merged with `cn`):
- Button (`default | destructive | outline | secondary | ghost | link`; sizes `default | sm | lg | icon | icon-sm | icon-lg`)
- Badge
- Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- Input, Textarea, Label
- Checkbox
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- Tabs, TabsList, TabsTrigger, TabsContent
- Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
- Progress
- Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption
- Avatar, AvatarImage, AvatarFallback
- Separator
- Icon (Lucide shim)

**app/** (built only from ui/):
- Logo, AppHeader, StatCard, TaskBadge, TaskProgress, TaskRow, TaskTable

Kit-local (not DS components): `ShortcutCard` in the Dashboard screen.

### Differences from upstream shadcn
- Select and Dialog keep the Radix composition API but are dependency-free (no portal; Dialog renders `fixed` in place so it inherits `.dark` from its subtree).
- `cn()` in `components/ui/utils.js` is clsx plus a small subset of tailwind-merge. In production use shadcn's `lib/utils.ts` (clsx + tailwind-merge).
- `Icon` renders Lucide glyphs from a CDN as a CSS mask. In production use `lucide-react` (shadcn's default `iconLibrary`).
- `CardTitle` and `DialogTitle` add `font-heading tracking-tight` for the brand heading face.

## Using in production
1. `npx shadcn@latest init` (Tailwind v4, new-york), then `npx shadcn@latest add button badge card input textarea label checkbox select tabs dialog progress table avatar separator`.
2. Replace the generated `globals.css` with `shadcn/globals.css`, and copy `tokens/colors.css`, `tokens/radius.css`, `tokens/fonts.css` next to it.
3. Copy the app blocks from `components/app/` (swap `Icon name="x"` for the lucide-react component).
4. Toggle dark mode with `document.documentElement.classList.toggle('dark', isDark)`.

## Tokens
- **shadcn roles:** `--background --foreground --card --popover --primary --secondary --muted --accent --destructive --border --input --ring` (+ `-foreground` pairs). Utilities: `bg-primary`, `text-muted-foreground`, `border-border`, `ring-ring/50`…
- **App extensions:** `--success`, `--warning` (due today), `--chart-1..3` (Completed / In progress / To do), `--status-{todo,progress,done}` and `--priority-{high,medium,low}` with `-foreground` pairs → `bg-status-done text-status-done-foreground`, etc.
- **Radius:** `--radius: 0.625rem` → `rounded-sm/md/lg/xl`.
- **Fonts:** `font-sans` = DM Sans, `font-heading` = Bricolage Grotesque.

## CONTENT FUNDAMENTALS
- **Voice:** plain, calm, second person, brief ("Choose how the app looks.", "Update the name shown across the app.", "Add the details. You can change them later.").
- **Casing:** sentence case everywhere — "New task", "Create task", "Save changes", "View all", "Recent tasks". Only the eyebrow date is uppercase, via CSS.
- **Greeting** by time of day with first name: "Good evening, Rakesh".
- **Live counts, pluralised:** "1 task is due today and 8 are still to do.", "16 tasks in total, 8 still to do.", "Showing 8 of 16 tasks".
- **Captions** are short fragments: "31% of all tasks", "2 due this week", "1 due today".
- **Dates:** "Today", "Tomorrow", "Wed, 21 Oct" (future), "16 Oct" (past), "Monday, 19 October" (eyebrow), "Joined 18 Oct 2026". Empty due = "—".
- No emoji, no exclamation marks. Accessible labels are explicit verbs: "Log out", "Switch to light theme", "Edit {title}".

## VISUAL FOUNDATIONS
- **Color:** one accent (`primary`); everything else is neutral roles plus the semantic set (destructive, success, warning). Status/priority always show a text label on a tinted pill (≈14–16% alpha in dark, pale solids in light).
- **Type:** headings and numbers in `font-heading` bold, `tracking-tight` (page h1 `text-4xl`, card titles `text-lg`, stats `text-4xl tabular-nums`). Body `text-sm`/`text-base` DM Sans; labels `text-sm font-medium`; badges `text-xs font-medium`; eyebrow `text-xs font-semibold tracking-widest uppercase`.
- **Surfaces:** flat colors only. Cards `rounded-xl border shadow-sm`, padding via `px-6 py-6`. Light page and cards are both white; dark cards sit slightly lighter than the page.
- **Controls:** h-9 (`sm` h-8), `rounded-md`, `shadow-xs`; focus is `ring-[3px] ring-ring/50` + `border-ring`.
- **Elevation:** xs controls, sm cards, md popovers (Select), lg dialog over `bg-black/50`.
- **Layout:** `max-w-6xl` (Dashboard, Tasks) / `max-w-5xl` (Profile), `px-8 pt-10 pb-16`, `gap-6`–`gap-8` between sections; stats in `sm:grid-cols-3`; Dashboard rail 320px from `lg`.
- **Hover:** shadcn defaults — `hover:bg-primary/90`, `hover:bg-accent`, table rows `hover:bg-muted/50`. Transitions are `transition-all`/`transition-colors`; no motion beyond that.
- **Imagery:** none; avatars are initials on `bg-primary`.

## ICONOGRAPHY
- Lucide outline icons (2px stroke): check, plus, calendar, clock, circle-check, list, user, chevron-right, chevron-down, arrow-right, pencil, trash-2, sun, moon, log-out, search, x.
- Default `size-4` (16px); `size-3.5` inline with `text-xs`; `size-[18px]` in the logo mark. Icons inherit `currentColor`.
- No emoji or unicode glyph icons (except "—").
- **Logo:** no file exists; `Logo` renders a `size-8 rounded-lg bg-primary` square with a check plus the "Clean Architecture" wordmark (`font-heading text-lg font-bold`).

## Fonts
Google Fonts (`tokens/fonts.css`): Bricolage Grotesque 600/700, DM Sans 400–700. For production, self-host via `@fontsource-variable/bricolage-grotesque` and `@fontsource/dm-sans`.
