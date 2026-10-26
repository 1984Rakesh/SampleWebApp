Dialog is shadcn/ui's `Dialog` (Radix) content for creating or editing a task: a title, a short subtitle, a close button, form fields and right-aligned actions.

**Provide:** `title`, optional `subtitle`, `onClose` or `closeHref`, `children` (fields), and `actions` (Cancel as an outline Button, then the default Button) or, where only text props are possible, `submitLabel`, `cancelLabel`, `submitHref`, `cancelHref`, `onSubmit`, `onCancel`. The consumer (Radix `Dialog`) provides the overlay (`bg-overlay`), focus trapping, Esc handling and the open state; this component draws only the panel, at most 540px wide.

**Do**
- Reuse it for both "New task" and "Edit task".
- Put the title field first and focus it on open; disable the default action until it has a value.

**Don't**
- Don't nest dialogs or put long forms in it; use a page.
- Don't hide the close button.
