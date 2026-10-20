# Tasks app UI kit

Click-through recreation of the Clean Architecture tasks app built only from this design system's shadcn/ui primitives and app blocks, styled with Tailwind v4 utilities (preview runtime via `tw-preview.js`).

- `index.html` — shell: routing (Dashboard, Tasks, Profile, Comparison placeholder), theme (Light/Dark/System in `localStorage['color-mode']`, applied as `.dark` on `<html>`), task state.
- `screen-dashboard.jsx` — greeting, StatCards, Recent tasks (Card + TaskRow), Overall progress (TaskProgress), shortcut cards.
- `screen-tasks.jsx` — search Input, status Tabs, priority Select, TaskTable with pagination.
- `task-dialog.jsx` — New/Edit task on Dialog.
- `screen-profile.jsx` — profile Card, account form, Appearance Tabs.
- `screen-auth.jsx` — Sign in (`#login`) and Create account (`#register`): Logo + Card with Label/Input fields; Log out in the header goes to Sign in.
- `data.js` — sample tasks, date labels, stats.
