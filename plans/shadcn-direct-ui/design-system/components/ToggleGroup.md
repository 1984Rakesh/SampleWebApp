ToggleGroup is shadcn/ui's `ToggleGroup` (`type="single"`) in a bordered track, for choosing one value from two to four short options. It replaces the old Segmented control and the MUI Tabs/ToggleButtonGroup.

**Provide:** `options` (strings), `value`, `onChange`, `label` (accessible name), optional `kind="priority"` to tint the selected option with the priority colours, `block` to stretch options across the width, `size="sm"` (34px) for filters and the theme picker, and `counts` (an object keyed by option) to show a count after each label.

**Tailwind:** track `rounded-md border border-input bg-muted p-1`; selected `bg-accent text-accent-foreground font-semibold`; unselected `text-muted-foreground`.

**Do**
- Use it for Priority in the task dialog and for the Light, Dark, System theme choice.
- Keep option labels one word.

**Don't**
- Don't use it for navigation (use the header pills) or for more than four options (use `Select`).
