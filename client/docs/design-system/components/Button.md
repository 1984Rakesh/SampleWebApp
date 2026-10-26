Button is shadcn/ui's `Button` with this system's sizes. In the app it is `src/components/ui/button.tsx` from `pnpm dlx shadcn@latest add button`, with the variants below added.

**Provide:** `children` (the label, sentence case, a verb), optional `icon`, `variant` (`default`, `secondary`, `outline`, `ghost`, `ghost-destructive`, `destructive`, `link`), `size` (`default` 46px, `sm` 36px, `icon` 40px, `icon-sm` 36px), `href` to render a link, `disabled`, `onClick`. Icon-only sizes need `aria-label`.

**Tailwind:** default is `bg-primary text-primary-foreground`; outline is `border border-input bg-transparent`; destructive is `border-destructive-border text-destructive` on a transparent fill (an outlined, not a filled, danger button); disabled default is `bg-secondary text-muted-foreground`; focus is `focus-visible:ring-2 ring-ring ring-offset-2`.

**Do**
- Label the action: "New task", "Create task", "Save changes", "Cancel".
- Pair Cancel (outline) with the default action, in that order, right aligned in dialogs and forms.
- Disable the default action until required fields are filled.

**Don't**
- Don't put two default (primary) buttons in one view.
- Don't use red filled buttons; destructive actions are the outlined icon button or a confirm step.
- Don't use an icon button without `aria-label`.
