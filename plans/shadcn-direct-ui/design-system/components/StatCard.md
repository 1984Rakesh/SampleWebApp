StatCard is a shadcn/ui `Card` showing one task count with its label, a tinted icon tile and a one-line caption.

**Provide:** `label`, `value` (a number from the task list), `tone` (`done`, `progress` or `todo`, which sets the icon and tile colour) and `caption`. Set `alert` to colour the caption `text-warning` for "due today".

**Do**
- Show three in a wrapping grid (`grid gap-4 sm:grid-cols-3`): Completed, In progress, To do.
- Derive the caption from real data ("44% of all tasks", "2 due this week").

**Don't**
- Don't add decorative trend arrows or sparklines.
- Don't use the tile colours for anything other than these three statuses.
