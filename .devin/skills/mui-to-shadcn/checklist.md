# Per-screen checklist

Run in **light** and **dark** for each migrated screen.

## Code
- [ ] No imports from `@mui/*`, `@emotion/*`; no `sx`, `styled`, `makeStyles`.
- [ ] No hex/rgb literals or arbitrary color utilities; only token roles.
- [ ] Icons from `lucide-react`, default `size-4`.
- [ ] Business logic, handlers, routes, test ids unchanged (diff shows presentation only).
- [ ] Form controls: every `Input`/`Select`/`Checkbox` has a `Label` with matching `htmlFor`/`id`; errors set `aria-invalid`.
- [ ] Icon-only buttons have `aria-label` ("Log out", "Switch to light theme", "Edit {title}").
- [ ] Typecheck, lint, existing tests pass.

## Visual (compare to `ui_kits/tasks-app/`)
- [ ] Layout width: Dashboard/Tasks `max-w-6xl`, Profile `max-w-5xl`; `px-8 pt-10 pb-16`.
- [ ] Headings in Bricolage Grotesque, body in DM Sans.
- [ ] Cards `rounded-xl border shadow-sm`; light page and cards white, dark cards `#11151D` on `#0A0D13`.
- [ ] Status/priority pills show text label on tinted background.
- [ ] Focus ring visible on keyboard navigation.
- [ ] No flash of the wrong theme on reload; System mode follows OS.
- [ ] Copy: sentence case, no exclamation marks, pluralised counts, date formats per readme.

## Screen-specific
- **Dashboard:** greeting by time of day, eyebrow date, 3 stat cards `sm:grid-cols-3`, 320px rail from `lg`, Recent tasks + View all.
- **Tasks:** filter Tabs (All / To do / In progress / Done), "Showing X of Y tasks", row hover `bg-muted/50`, empty due = "—".
- **Task dialog:** DialogHeader title + description, footer Cancel (outline) + Create task / Save changes, `bg-black/50` overlay, Esc closes.
- **Profile:** name field, theme Light/Dark/System persisted in `localStorage['color-mode']`, "Joined {d MMM yyyy}".
- **Sign in / Create account:** centred card, labelled fields, primary submit full width, link to the other screen.
