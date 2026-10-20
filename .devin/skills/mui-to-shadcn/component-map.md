# Component map: design system ↔ repo

This file lives at `.devin/skills/mui-to-shadcn/component-map.md`. Update it in the same PR whenever a component is added, renamed or moved on either side.

DS root = `.devin/skills/mui-to-shadcn/design-system/`. Repo paths are under `client/src/`.

## Rules
1. **Same name, same props.** A repo component that implements a DS component uses the props from the DS `.d.ts`. Extra props are allowed; renamed or removed props are not. The repo side may be a sealed `Ui*` wrapper rather than a same-named export — the wrapper is the mapped file.
2. **Fixed locations.** DS `components/ui/X.jsx` → repo `components/ui/x.tsx` (shadcn kebab-case file) or the `Ui*` sealed wrapper that stands in for it. DS `components/app/X.jsx` → repo `components/app/X.tsx`, unless the component is feature-owned (e.g. TaskTable lives in the tasks feature) or is the shared layout shell (AppHeader → `components/layout/`).
3. **`data-slot` marker.** Mapped shadcn files render `data-slot="<kebab-name>"` on their root. `Ui*` wrappers use semantic markup; check a running page with `document.querySelectorAll('[data-slot]')` for the shadcn subset.
4. **Header comment.** The first line of each mapped repo file is `// @ds <Name> v<date-synced>`. Grep `@ds ` to list every mapped file.
5. **Screens consume, never restyle.** Feature screens/components import from `components/ui` (`Ui*` + `SelectOption`) and `components/app` only. If a screen needs a new look, change or add the component, never one-off classes on the screen.

## Map
| DS component | DS source | Repo file | Status |
|---|---|---|---|
| Button | components/ui/Button.jsx | client/src/components/ui/button.tsx | shadcn |
| Badge | components/ui/Badge.jsx | client/src/components/ui/badge.tsx | shadcn |
| Card (+Header/Title/Description/Action/Content/Footer) | components/ui/Card.jsx | client/src/components/ui/card.tsx | shadcn + `font-heading tracking-tight` on CardTitle |
| Input | components/ui/Input.jsx | client/src/components/ui/input.tsx | shadcn |
| Textarea | components/ui/Textarea.jsx | client/src/components/ui/textarea.tsx | shadcn |
| Label | components/ui/Label.jsx | client/src/components/ui/label.tsx | shadcn |
| Checkbox | components/ui/Checkbox.jsx | client/src/components/ui/checkbox.tsx | shadcn |
| Select | components/ui/Select.jsx | client/src/components/ui/select.tsx | shadcn (Radix); DS version is a simplified preview |
| Tabs | components/ui/Tabs.jsx | client/src/components/ui/UiTabs.tsx | sealed wrapper — renders a toggle group (aria-pressed buttons), not Radix tabs |
| Dialog | components/ui/Dialog.jsx | client/src/components/ui/dialog.tsx | shadcn (Radix) + `font-heading tracking-tight` on DialogTitle |
| Progress | components/ui/Progress.jsx | — | not vendored; single-bar progress is inlined, segmented progress is TaskProgress/UiProgress |
| Table | components/ui/Table.jsx | client/src/components/ui/table.tsx | shadcn |
| Avatar | components/ui/Avatar.jsx | client/src/components/ui/avatar.tsx | shadcn |
| Separator | components/ui/Separator.jsx | client/src/components/ui/separator.tsx | shadcn |
| Icon | components/ui/Icon.jsx | client/src/components/ui/UiIcon.tsx | sealed wrapper over `lucide-react` (closed `UiIconName` union) |
| Logo | components/app/Logo.jsx | client/src/components/app/Logo.tsx | port |
| TaskBadge | components/app/TaskBadge.jsx | client/src/components/ui/UiChip.tsx | tone-based `UiChip` on shadcn Badge; status/priority tones applied in feature mappers |
| TaskProgress | components/app/TaskProgress.jsx | client/src/components/ui/UiProgress.tsx | segmented status bar; used by dashboard `DashboardProgress` |
| StatCard | components/app/StatCard.jsx | client/src/components/app/StatCard.tsx | port |
| TaskRow | components/app/TaskRow.jsx | client/src/components/app/TaskRow.tsx | port |
| TaskTable | components/app/TaskTable.jsx | client/src/tasks/presentation/components/taskList/TaskTable.tsx | feature-owned (tasks); ViewState-driven, Ui* composition |
| AppHeader | components/app/AppHeader.jsx | client/src/components/layout/Navbar.tsx (+ `navbar/NavbarToolbar.tsx`, `navbar/NavbarDrawer.tsx`); App wiring in `client/src/app/composition/AppNavbar.tsx` | shared prop-driven shell; App owns state |

## Screens
| DS screen (visual target) | Repo route / file |
|---|---|
| ui_kits/tasks-app/screen-dashboard.jsx | /dashboard → client/src/dashboard/presentation/screens/DashboardScreen.tsx |
| ui_kits/tasks-app/screen-tasks.jsx | /tasks → client/src/tasks/presentation/screens/TaskListScreen.tsx |
| ui_kits/tasks-app/task-dialog.jsx | client/src/tasks/presentation/components/TaskDialog.tsx |
| ui_kits/tasks-app/screen-profile.jsx | /profile → client/src/profile/presentation/screens/ProfileScreen.tsx |
| ui_kits/tasks-app/screen-auth.jsx | /sign-in, /sign-up → client/src/security/presentation/screens/LoginScreen.tsx, RegisterScreen.tsx |
| — (no DS screen) | /comparison → client/src/comparison/presentation/screens/ComparisonScreen.tsx |

## DS → repo (design system changed)
1. Diff the DS files that changed. For each changed component, find its row → repo file.
2. Apply the change and bump `// @ds <Name> v<date>`.
3. Run `checklist.md` on the screens that use it (`grep -rl "<Name>\|Ui<Name>" client/src --include="*.tsx" | grep -v components/ui`).

## Repo → DS (new or changed in the app)
1. A new reusable component in the repo (used on 2+ screens, or a new pattern): add a row with Status `repo-only`.
2. Hand it back for the DS. Send the file path, a screenshot (light and dark) and its props. It gets added as `components/app/<Name>.jsx` + `.d.ts` + a card, then the row's Status becomes `port`.
3. One-off markup on a single screen stays in the screen and isn't mapped.

## Audit (run any time)
```bash
# mapped files and their sync date
grep -rn "^// @ds " client/src
# screens bypassing the system
grep -rnE "bg-\[#|text-\[#|style=\{\{" client/src --include="*.tsx" | grep -v components/
# components/app files not in the map
comm -23 <(ls client/src/components/app | sed 's/.tsx//' | sort) <(grep -oE "components/app/[A-Za-z]+" .devin/skills/mui-to-shadcn/component-map.md | xargs -n1 basename | sort)
```
