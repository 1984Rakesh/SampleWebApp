Badge is shadcn/ui's `Badge` (pill) with task semantics: priority and status. In the app add `priority-*` and `status-*` variants to `src/components/ui/badge.tsx`.

**Provide:** `kind` (`status` or `priority`) and `value`. Priority: High, Medium, Low. Status: To do, In progress, Done. Custom text can be passed as `children`.

**Tailwind:** `bg-priority-high text-priority-high-foreground`, `bg-status-progress text-status-progress-foreground`, `bg-status-done text-status-done-foreground`, `bg-secondary text-secondary-foreground` for To do; `rounded-full px-2.5 py-[3px] text-xs font-medium`. Priority badges carry a 6px dot before the label; status badges do not.

**Do**
- Always show the word; colour never carries meaning alone.
- Order badges status then priority.

**Don't**
- Don't invent extra badge colours; add a token first.
