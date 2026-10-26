TaskRow is one task in a list: a checkbox, title, description, status and priority badges, and a due date. It is a composition, not a shadcn primitive: `Checkbox` + `Badge` inside a `Card` list.

**Provide:** `title`, `status`, `priority`, and optionally `description`, `due` (text such as "Today" or "Wed, 21 Oct"), `dueToday` (turns the date `text-warning`), `done` and `onToggle`. Rows have no actions of their own; completing is the checkbox, and edit and delete live in the Tasks table.

**Do**
- Stack rows inside a `bg-card` card with `rounded-xl border`; rows separate with a 1px `border-divider` line.
- Order badges status then priority.

**Don't**
- Don't add Complete and Delete buttons per row on the dashboard.
- Don't truncate the title; wrap it. The description may truncate to one line in tables.
