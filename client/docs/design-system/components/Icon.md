Icon draws one of the system's stroke icons inline at any size, in the current text color. In the app use `lucide-react` (shadcn's default icon library); these names map 1:1 (Check, CircleCheck, Clock, List, Plus, Search, Sun, Moon, LogOut, Calendar, Pencil, Trash2, ChevronDown, ChevronRight, User, X, ArrowRight).

**Provide:** `name` (one of the listed names). Optional `size` (default 18) and `strokeWidth` (default 1.8; use 3.2 for the check inside a checkbox).

**Do**
- Use inside text-colored containers: the icon inherits `currentColor`, so `text-muted-foreground`, `text-destructive` and `text-primary` colour it.
- Put an `aria-label` on the button or link that contains an icon-only control.

**Don't**
- Don't use emoji or other icon sets next to these icons.
- Don't use an icon alone to carry status; add the badge word or label.
