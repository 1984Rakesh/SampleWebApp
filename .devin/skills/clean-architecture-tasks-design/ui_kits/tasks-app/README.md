# Tasks web app — UI kit

Click-through recreation of the redesigned Clean Architecture tasks app (React + MUI target), built from `uploads/design-spec (1).md` and the dark-theme reference screens in `assets/reference/`.

- `index.html` — app shell: header, hash routing (`#dashboard`, `#tasks`, `#profile`, `#comparison`), Light/Dark/System theme persisted in `localStorage['color-mode']`.
- `screen-dashboard.jsx` — hero, stat cards, Recent tasks, Overall progress, shortcut cards (`ShortcutCard` is kit-local).
- `screen-tasks.jsx` — title row, search + status tabs + priority select (instant filtering), table, pagination.
- `task-dialog.jsx` — New task / Edit task dialog.
- `screen-profile.jsx` — profile card, Account details, Appearance.
- `data.js` — 16 sample tasks (copy from the reference screens; the 8 not visible there are filler), stats helpers, date labels relative to today.

Comparison is in the nav but not specified; it renders an intentionally blank page.
