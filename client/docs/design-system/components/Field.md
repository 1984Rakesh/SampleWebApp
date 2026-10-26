Field is shadcn/ui's `Label` + `Input` (or `Textarea`) pair. In the app compose `Label` and `Input` from `ui/label` and `ui/input` in a `flex flex-col gap-2` wrapper.

**Provide:** `label`, `required` (adds a `text-destructive` asterisk), `multiline` (Textarea), `icon` (trailing icon such as `calendar`), `placeholder`, `readOnly`, `value` or `defaultValue`, `type`, `onChange`, `leadingIcon` (for example `search`), `hideLabel` (label becomes the aria-label, for search boxes), `compact` (44px), `surface` (card fill instead of the input fill) and `focused` to preview the focus state in documentation.

**Tailwind:** input is `h-12 rounded-md border border-input bg-inset px-3.5 text-[15px]`; focus is `border-ring ring-1 ring-ring`; read-only is `border-border bg-muted text-muted-foreground`.

**Do**
- Keep the label above the field, 13px semibold.
- Mark required fields with the asterisk and `aria-required`.
- Use `type="date"` for the due date; the trailing calendar icon is decorative.

**Don't**
- Don't use placeholder text as the label.
- Don't turn the border red alone for errors; add a message below the field.
