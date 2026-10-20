# Clean Architecture Tasks — Design System

Design system for **Clean Architecture**, a personal tasks app (React + MUI front end, Node back end, clean-architecture layering). It encodes the UI redesign: a refined interface with two themes — **dark** (deep ink, quiet bordered cards, soft periwinkle accent) and **light** (cool off-white, white bordered cards, deeper indigo accent). Theme choice is Light / Dark / System, persisted under `localStorage['color-mode']`, default System.

One product surface: the **tasks web app** — Dashboard, Tasks, New/Edit task dialog, Profile (plus a "Comparison" nav item that the spec does not define).

## Sources
- `uploads/design-spec (1).md` — "Tasks App UI Redesign: Design Spec (light + dark)": tokens, MUI theme code, header and screen specs. All numeric values here come from it.
- `uploads/Tasks App Redesign.pdf` — four dark-theme reference screens; rendered copies in `assets/reference/` (`dashboard-dark.jpg`, `tasks-dark.jpg`, `create-task-dialog-dark.jpg`, `profile-dark.jpg`). Sample copy (tasks, user "Rakesh James Patole") is taken from these.
- The spec references `docs/design/*.png` (dark + light per screen) in the app repo; light-theme images were not provided. No codebase or Figma was attached.

## Index
- `styles.css` — entry point (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
- `components/` — React primitives (see list below), each with `.d.ts` + `.prompt.md` and one card per folder
- `ui_kits/tasks-app/` — interactive recreation of the app (`index.html`)
- `guidelines/` — foundation specimen cards (colors, type, spacing, brand)
- `assets/reference/` — reference screenshots
- `thumbnail.html`, `SKILL.md`

## Components
- **core/**: Icon, Button, IconButton, Card, Chip, Avatar, Logo
- **forms/**: TextField, Select, Checkbox, Tabs, SegmentedControl
- **navigation/**: AppHeader, NavPill, UserPill
- **data/**: StatCard, ProgressBar, TaskRow, TaskTable
- **overlay/**: Dialog

Kit-local (not a DS component): `ShortcutCard` in the Dashboard screen.

### Intentional additions
- **Icon** — wrapper for the Lucide CDN glyph set so every component uses one icon API.
- **Logo** — the spec describes the mark (32px accent square + check + wordmark); packaged as a component since it repeats.

## Theming
Light is the `:root` default; put `data-theme="dark"` on `<html>` (or any subtree) for dark. `[data-theme="light"]` re-scopes light inside a dark page. Components only reference CSS variables, so they switch automatically. For System, resolve `prefers-color-scheme` in JS and set the attribute (see the kit's `index.html`).

## CONTENT FUNDAMENTALS
- **Voice:** plain, calm, second person, brief. The app talks *to* the user ("Choose how the app looks.", "Update the name shown across the app.", "Add the details. You can change them later.").
- **Casing:** sentence case everywhere — buttons ("New task", "Create task", "Save changes", "View all"), titles ("Recent tasks", "Overall progress", "Account details"). Only the eyebrow date and table headers are uppercase, and that is done with CSS (`text-transform`), not in the copy.
- **Personal greeting** by time of day: "Good evening, Rakesh" (first name only).
- **Counts in sentences, derived live:** "1 task is due today and 8 are still to do.", "16 tasks in total, 8 still to do.", "31% of 16 tasks done", "Showing 8 of 16 tasks". Pluralise correctly.
- **Captions are short fragments:** "31% of all tasks", "2 due this week", "1 due today", "Create, edit and organize", "Update your details".
- **Dates:** relative when close ("Today", "Tomorrow"), otherwise "Wed, 21 Oct" (future) / "16 Oct" (past); full date in the eyebrow "Monday, 19 October"; "Joined 18 Oct 2026". Empty due = "—".
- **Task copy** is developer-flavoured: "Review pull request #42", "Set up MUI theme tokens", one-sentence descriptions ending in a period.
- No emoji, no exclamation marks, no marketing tone. Accessibility labels are explicit verbs: "Log out", "Switch to light theme", "Edit {title}".

## VISUAL FOUNDATIONS
- **Color:** two complete palettes with identical roles. Dark: page #0A0D13, header #0D1118, cards #11151D, periwinkle accent #8C9EFF with ink text on it. Light: page #F5F6FA, white header/cards, indigo #4655D4 with white text. One accent only; everything else is neutral greys plus the semantic set (danger coral/red, done green, amber "due today"). Status/priority are tinted chips (≈14–16% alpha tints in dark, pale solids in light) and always carry a text label.
- **Type:** Bricolage Grotesque (600/700, tight -0.01 to -0.02em) for headings and numbers — h1 42, dialog 28, card title 22, stats 48. DM Sans (400/500/600) for everything else — body 15–16, secondary 13–14, labels 13/600, chips 12/500, caps labels 12/600 tracked 0.08–0.1em.
- **Backgrounds:** flat solid colors only. No images, gradients, textures or illustrations.
- **Cards:** 20px radius (18 allowed), 1px border (#1E2430 / #E4E7EE), padding 20–28px. Dark: no shadow, separation comes from the border and a slightly lighter surface. Light: a barely-there 0 1px 2px rgba(20,24,36,.04).
- **Borders** carry the hierarchy: card, subtle row separators, input (stronger), control (icon buttons, pills, toolbar). Rows inside cards are separated by 1px subtle lines that run edge to edge.
- **Radii:** controls/inputs/buttons/tabs container 12px; inner segmented option 9px; icon tiles ~10px; dialog 24px; chips, nav pills, user pill, avatars fully round.
- **Shadows:** cards as above; only the dialog has a real drop shadow (MUI elevation-24 equivalent). No inner shadows. Selected segmented option in light = white pill with a subtle shadow.
- **Layout:** content max 1200px (Dashboard, Tasks) / 1000px (Profile), 32px side padding, 44px top / 72px bottom, 24–32px between sections. Dashboard right rail 300px; two-column areas wrap below ~900px; tables keep min-width 860px and scroll horizontally. The header is a full-width bar with bottom border, not fixed in the references.
- **Hover / press:** not specified in the spec. Implemented conservatively: primary buttons mix ~12% of the text color into the accent (lighter in dark, darker in light); outlined/icon buttons get a 6% text-color overlay; nav pills brighten text to primary. No scale/shrink on press.
- **Focus:** visible 2px accent outline (`--focus-ring`); inputs switch their border to the accent at 1.5px.
- **Animation:** minimal — 150ms ease color/border transitions only. No bounces or page transitions.
- **Transparency / blur:** only for chip tints in dark and the dialog scrim (rgba(20,24,36,.5) light; MUI default black 50% dark). No backdrop blur.
- **Imagery:** none in the product; avatars are initials on the accent color.
- **Contrast:** text ≥ 4.5:1 in both themes; unchecked checkbox ring ≥ 3:1.

## ICONOGRAPHY
- The reference screens use thin outline icons (≈2px stroke, rounded caps): check, plus, calendar, clock, circle-check, list, user, chevron-right, arrow-right, pencil, trash, sun/moon, log-out, search, x, chevron-down. The spec doesn't name the set (likely `@mui/icons-material` outlined or similar) and no icon files were supplied.
- **Substitution:** this system uses **Lucide** (`lucide-static@0.460.0` from unpkg) through the `Icon` component, which renders the SVG as a CSS mask filled with `currentColor`. Visually close to the references; flagged for confirmation.
- Sizes: 18px in 40px buttons and tiles, 16px in inputs/table actions, 14px inline with small text.
- Icons inherit color from context: `--text-secondary` in inputs, chip/tile foreground inside tinted tiles, `--danger` for delete/logout, `--on-primary` inside the logo mark and primary buttons.
- No emoji, no unicode-glyph icons (except "—" for empty due dates).
- **Logo:** no logo file exists. The spec defines the mark as a 32px accent rounded square with a check icon plus the "Clean Architecture" wordmark in Bricolage 19/700 — implemented as the `Logo` component, not as an image asset.

## Fonts
Loaded from Google Fonts (`tokens/fonts.css`): Bricolage Grotesque 600/700, DM Sans 400–700. The spec suggests `@fontsource-variable/bricolage-grotesque` and `@fontsource/dm-sans` for production; no font binaries were provided, so there are no local `@font-face` files.
