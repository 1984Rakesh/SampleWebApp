TaskTableHead and TaskTableRow draw the Tasks table. In the app use shadcn `Table` with the same columns: checkbox, task (title + one-line description), status badge, priority badge, due date, edit and delete icon buttons.

**Provide (row):** `title`, `status`, `priority`, optional `description`, `due`, `dueToday`, `done`, `onToggle`, `onEdit`, `onDelete`. Wrap head and rows in a `min-w-[860px]` box inside an `overflow-x-auto` container so the table scrolls on small screens.

**Do**
- Strike through and mute the title of done tasks.
- Show an em dash for a missing due date.
- Delete is `text-destructive` and always carries `aria-label="Delete task"`.

**Don't**
- Don't add more columns; use the task dialog for extra fields.
