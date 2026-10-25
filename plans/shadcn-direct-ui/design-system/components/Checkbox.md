Checkbox is the round control that marks a task done or not done. In the app use shadcn/ui's `Checkbox` (Radix) restyled `rounded-full`, with `data-[state=checked]:bg-success data-[state=checked]:border-success`.

**Provide:** `checked` and `onChange`. Its accessible name defaults to "Mark as done" or "Mark as not done"; pass `label` to override it.

**Do**
- Place it at the start of a task row, aligned with the first line of the title.
- Strike the title through and mute it (`text-muted-foreground line-through`) when checked; TaskRow does this.

**Don't**
- Don't use it for settings toggles or multi-select forms (use shadcn `Switch` or the square `Checkbox`).
- Don't rely on the green fill alone; a Done badge or label stays visible.
