# MUI → shadcn mapping

## Components
| MUI | shadcn / DS | Notes |
|---|---|---|
| `Button variant="contained"` | `Button` (default) | `color="error"` → `variant="destructive"` |
| `Button variant="outlined"` | `Button variant="outline"` | |
| `Button variant="text"` | `Button variant="ghost"` | link-style → `variant="link"` |
| `Button size="small/large"` | `size="sm" / "lg"` | |
| `Button startIcon={<X/>}` | `<Button><X /> Label</Button>` | icon as first child |
| `IconButton` | `Button variant="ghost" size="icon"` | always `aria-label` |
| `LoadingButton` | `Button disabled` + `<Loader2 className="animate-spin" />` | |
| `TextField` | `Label` + `Input` | wrap in `div.grid gap-2`; `htmlFor`/`id` pair |
| `TextField multiline` | `Label` + `Textarea` | |
| `TextField helperText` | `<p className="text-sm text-muted-foreground">` | error: `text-destructive`, set `aria-invalid` on Input |
| `TextField select` / `Select` + `MenuItem` | `Select > SelectTrigger > SelectValue` + `SelectContent > SelectItem` | `onChange(e)` → `onValueChange(value)` |
| `Checkbox` + `FormControlLabel` | `Checkbox` + `Label` | `onChange(e)` → `onCheckedChange(checked)` |
| `Chip` | `Badge` | status/priority → `TaskBadge` |
| `Card`, `CardContent`, `CardHeader`, `CardActions` | `Card`, `CardContent`, `CardHeader` (+`CardTitle`/`CardDescription`/`CardAction`), `CardFooter` | `Paper` → `Card` or `div.rounded-xl.border.bg-card` |
| `Dialog` + `DialogTitle` + `DialogContent` + `DialogActions` | `Dialog > DialogContent > DialogHeader(DialogTitle, DialogDescription)` + body + `DialogFooter` | `open`/`onClose` → `open`/`onOpenChange` |
| `ToggleButtonGroup` / segmented control | `Tabs` + `TabsList` + `TabsTrigger` (no `TabsContent` when used as a filter) | `onChange(e,v)` → `onValueChange(v)` |
| `Tabs` + `Tab` | `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent` | |
| `LinearProgress variant="determinate"` | `Progress value={n}` | task completion → `TaskProgress` |
| `Table*` | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | task list → `TaskTable` / `TaskRow` |
| `Avatar` | `Avatar > AvatarFallback` (initials, `bg-primary text-primary-foreground`) | |
| `Divider` | `Separator` | `orientation="vertical"` kept |
| `AppBar` + `Toolbar` | `AppHeader` | nav pills → ghost/`secondary` Button; user pill → outline Button |
| `Typography variant="h1..h3"` | `h1 className="font-heading text-4xl font-bold tracking-tight"` etc. | see type scale below |
| `Typography variant="body1/body2"` | `p className="text-base / text-sm"` | |
| `Typography variant="caption"` | `text-xs text-muted-foreground` | |
| `Typography variant="overline"` | `text-xs font-semibold tracking-widest uppercase text-muted-foreground` | eyebrow date |
| `Box`, `Stack`, `Grid`, `Container` | `div` + `flex`/`grid`/`gap-*`/`max-w-6xl mx-auto px-8` | `Stack spacing={2}` → `flex flex-col gap-4` (1 MUI unit = 8px = `2`) |
| `CircularProgress` | `<Loader2 className="size-4 animate-spin" />` | |
| `Tooltip`, `Menu`, `Snackbar`, `Alert`, `Drawer` | not in DS | ask; if approved `npx shadcn add tooltip / dropdown-menu / sonner / alert / sheet` |
| `@mui/icons-material/*` | `lucide-react` | Add→`Plus`, Delete→`Trash2`, Edit→`Pencil`, CheckCircle→`CircleCheck`, Event→`Calendar`, Schedule→`Clock`, Person→`User`, Logout→`LogOut`, LightMode→`Sun`, DarkMode→`Moon`, Search→`Search`, Close→`X`, ChevronRight→`ChevronRight`, ExpandMore→`ChevronDown`, ArrowForward→`ArrowRight`, List→`List` |

## Tokens (`theme.palette.*` / old CSS vars → utilities)
| MUI / old | Utility |
|---|---|
| `background.default`, `--bg-default` | `bg-background` |
| `background.paper`, `--bg-paper` | `bg-card` (overlays: `bg-popover`) |
| `text.primary` | `text-foreground` |
| `text.secondary` | `text-muted-foreground` |
| `primary.main` / `contrastText` | `bg-primary` / `text-primary-foreground`, text-only `text-primary` |
| `error.main` | `text-destructive` / `bg-destructive` |
| `success.main` | `text-success` |
| `warning.main` (due today) | `text-warning` |
| `divider` | `border-border` |
| `action.hover` | `hover:bg-accent` (rows `hover:bg-muted/50`) |
| input outline | `border-input` |
| focus outline | `focus-visible:ring-[3px] ring-ring/50 border-ring` (built into primitives) |
| status todo/progress/done | `bg-status-{todo,progress,done} text-status-…-foreground` |
| priority high/medium/low | `bg-priority-{high,medium,low} text-priority-…-foreground` |
| chart series | `--chart-1` Completed, `--chart-2` In progress, `--chart-3` To do |

## Shape, spacing, elevation
- `theme.spacing(n)` → Tailwind `n*2` (8px grid → 4px scale): `p: 3` → `p-6`.
- `shape.borderRadius` → `rounded-md` (controls), `rounded-xl` (cards), `rounded-lg` (logo mark, dialog).
- `elevation={0..1}` → `shadow-xs`/`shadow-sm`; menus `shadow-md`; dialog `shadow-lg`.
- Breakpoints: `xs`→base, `sm`→`sm:`, `md`→`md:`, `lg`→`lg:`.

## Type scale
| Role | Classes |
|---|---|
| Page h1 | `font-heading text-4xl font-bold tracking-tight` |
| Card title | `font-heading text-lg font-semibold tracking-tight` (CardTitle) |
| Stat number | `font-heading text-4xl font-bold tracking-tight tabular-nums` |
| Body | `text-sm` / `text-base` |
| Label | `text-sm font-medium` |
| Badge | `text-xs font-medium` |
| Eyebrow | `text-xs font-semibold tracking-widest uppercase` |
