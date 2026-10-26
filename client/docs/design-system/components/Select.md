Select is the shadcn/ui `Select` trigger used for filters. The mockups use the native `<select>` look; in the app use shadcn `Select` (Radix) with `SelectTrigger` styled `h-11 rounded-md border-input bg-card`.

**Provide:** `label` (accessible name), `options` (strings), `value`, `onChange`. The first option can read "Priority: All" so the closed control says what it filters.

**Do**
- Use for lists of five or more options, or when horizontal space is tight; use ToggleGroup for two to four.
- Keep the chevron on the right and the label in `text-sm font-medium`.

**Don't**
- Don't hide the filter's name; it must be in the label or the first option.
