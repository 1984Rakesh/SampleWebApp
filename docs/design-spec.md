# Tasks App UI Redesign: Design Spec

Target stack: React + MUI (Material UI), Node backend. This is a **UI-only** change. Do not change API contracts, domain logic or the clean-architecture layering. Only presentation-layer files change.

Reference images live in `docs/design/` (Dashboard, Tasks, Create task dialog, Profile). Treat the images as the visual target and this file as the exact values.

---

## 1. Design direction

Refined dark UI. Deep ink background, quiet bordered cards, one soft periwinkle accent, color-coded chips for priority and status. Headings use Bricolage Grotesque, body uses DM Sans. Light mode is out of scope for now, but keep the theme structured so a light palette can be added later.

---

## 2. Tokens

### Colors

| Token | Value | Use |
|---|---|---|
| background.default | `#0A0D13` | page background |
| background.header | `#0D1118` | app bar |
| background.paper | `#11151D` | cards, table, dialog |
| background.inset | `#0D1118` | inputs inside cards/dialogs |
| divider / border | `#1E2430` | card borders |
| divider.subtle | `#1B212C` | row separators, header border |
| border.input | `#2A3242` | input and dialog borders |
| text.primary | `#ECEFF5` | main text |
| text.secondary | `#98A2B5` | descriptions, labels, inactive nav |
| primary.main | `#8C9EFF` | accent: buttons, logo, avatar, focus ring |
| primary.contrastText | `#0A0D13` | text on accent |
| primary.soft | `#A9B7FF` | links, in-progress text |
| error / logout | `#FF9E8C` | logout, delete icon, required asterisk |
| selected.bg | `#1A2030` | active nav pill |
| selected.bg2 | `#232B3B` | active tab / segmented option |
| neutral.tile | `#1E2430` | neutral icon tile, "To do" chip bg |

### Chip colors (text on tinted background)

| Kind | Text | Background |
|---|---|---|
| Priority High | `#FF9E8C` | `rgba(255,143,122,0.14)` |
| Priority Medium | `#F6C177` | `rgba(244,184,96,0.14)` |
| Priority Low | `#7FDCCB` | `rgba(111,211,195,0.14)` |
| Status To do | `#B5BDCC` | `#1E2430` |
| Status In progress | `#A9B7FF` | `rgba(140,158,255,0.16)` |
| Status Done | `#8FE3A8` | `rgba(111,214,140,0.14)` |

Priority chips show a 6px dot in the text color before the label. Done = `#8FE3A8` also used for the filled checkbox.

Unchecked checkbox ring: `#6B778E` (meets 3:1 contrast on `#11151D`).

### Typography

- Headings: `'Bricolage Grotesque'`, weights 600/700, letter-spacing -0.01em to -0.02em
- Body/UI: `'DM Sans'`, weights 400/500/600

| Role | Size | Weight |
|---|---|---|
| Page title (h1) | 42px | 700 |
| Dialog title | 28px | 700 |
| Card title (h2) | 22px | 600 |
| Stat number | 48px | 700 |
| Body | 15-16px | 400/500 |
| Secondary / description | 13-14px | 400 |
| Chip | 12px | 500 |
| Table header | 12px, uppercase, 0.08em tracking | 600 |
| Eyebrow (date) | 12px, uppercase, 0.1em tracking | 600 |

### Shape and spacing

- Cards: radius 18-20px, 1px border `#1E2430`, padding 20-28px
- Dialog: radius 24px, padding 28px, max-width 540px
- Inputs, buttons, tabs container: radius 12px; inner segmented option radius 9px
- Chips and nav pills: fully rounded (999px)
- Page content max-width: 1200px (Dashboard, Tasks), 1000px (Profile); horizontal padding 32px
- Gaps between sections: 24-32px

### Fonts

```
npm i @fontsource-variable/bricolage-grotesque @fontsource/dm-sans
```
Or load via the Google Fonts link for `Bricolage Grotesque` (600, 700) and `DM Sans` (400, 500, 600).

---

## 3. MUI theme (starting point)

Put in `src/theme/theme.ts` (adjust path to the project's structure).

```ts
import { createTheme } from '@mui/material/styles';

const display = "'Bricolage Grotesque', 'DM Sans', sans-serif";
const body = "'DM Sans', system-ui, sans-serif";

export const chipColors = {
  priority: {
    High:   { fg: '#FF9E8C', bg: 'rgba(255,143,122,0.14)' },
    Medium: { fg: '#F6C177', bg: 'rgba(244,184,96,0.14)' },
    Low:    { fg: '#7FDCCB', bg: 'rgba(111,211,195,0.14)' },
  },
  status: {
    'To do':       { fg: '#B5BDCC', bg: '#1E2430' },
    'In progress': { fg: '#A9B7FF', bg: 'rgba(140,158,255,0.16)' },
    Done:          { fg: '#8FE3A8', bg: 'rgba(111,214,140,0.14)' },
  },
} as const;

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#8C9EFF', contrastText: '#0A0D13' },
    error: { main: '#FF9E8C' },
    success: { main: '#8FE3A8' },
    warning: { main: '#F6C177' },
    background: { default: '#0A0D13', paper: '#11151D' },
    text: { primary: '#ECEFF5', secondary: '#98A2B5' },
    divider: '#1E2430',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: body,
    h1: { fontFamily: display, fontWeight: 700, fontSize: '2.625rem', letterSpacing: '-0.02em', lineHeight: 1.1 },
    h2: { fontFamily: display, fontWeight: 600, fontSize: '1.375rem', letterSpacing: '-0.01em' },
    h3: { fontFamily: display, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: '#0A0D13' } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'default' },
      styleOverrides: {
        root: { backgroundColor: '#0D1118', backgroundImage: 'none', borderBottom: '1px solid #1B212C' },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { backgroundColor: '#11151D', borderColor: '#1E2430', borderRadius: 20 },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, padding: '10px 20px' },
        outlined: { borderColor: '#2A3242', color: '#ECEFF5' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { height: 24, fontSize: 12, fontWeight: 500, borderRadius: 999 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#0D1118',
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2A3242' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8C9EFF', borderWidth: 1.5 },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundColor: '#11151D', border: '1px solid #2A3242', borderRadius: 24, padding: 8 },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 0, backgroundColor: '#11151D', border: '1px solid #232A37', borderRadius: 12, padding: 4 },
        indicator: { display: 'none' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 34, borderRadius: 9, textTransform: 'none', fontWeight: 500, color: '#98A2B5',
          '&.Mui-selected': { backgroundColor: '#232B3B', color: '#ECEFF5' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #1B212C' },
        head: { fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#98A2B5' },
      },
    },
  },
});
```

Wrap the app in `ThemeProvider` + `CssBaseline`. Remove existing hard-coded colors from components in favor of the theme.

---

## 4. Shared app header (all screens)

MUI `AppBar` (elevation 0) with a `Toolbar`, flex-wrap on small screens.

- Left: logo mark (32px rounded-square, `primary.main`, check icon in `#0A0D13`) + "Clean Architecture" in the display font (19px, 700). Click goes to Dashboard.
- Nav: Dashboard, Tasks, Profile, Comparison. Pill-shaped links (radius 999, 8px 14px padding, 14px/500). Active = `#1A2030` background and `text.primary`; inactive = `text.secondary`. Use `NavLink` and its active state.
- Right: theme toggle `IconButton` (40px, 12px radius, 1px `#232A37` border), a user pill (avatar 32px with initial + full name, 1px border, links to Profile), and a logout `IconButton` in `#FF9E8C` with border `#3A2A2E`.
- Replace the current red "Logout" text button with the icon button. Give it `aria-label="Log out"`.
- All icon-only buttons need `aria-label`.

---

## 5. Screens

### 5.1 Dashboard (`/dashboard`)

Content: `Container maxWidth={1200}`, padding 44px 32px 72px, 32px vertical gap.

1. **Hero row:** eyebrow with today's date (uppercase), h1 "Good evening, {firstName}" (greeting by time of day), subtitle "{n} task(s) due today and {m} still to do." Right side: primary `Button` "New task" with plus icon, opens the create-task dialog.
2. **Stat cards:** three cards in a flex-wrap row (`flex: 1 1 240px`): Completed, In progress, To do. Each has the label, a 36px tinted icon tile, a 48px number and a caption. Tiles: Completed = green tint `#8FE3A8`, In progress = periwinkle `#A9B7FF`, To do = neutral `#1E2430` / `#B5BDCC`. Captions: share of total for Completed, "x due this week" for In progress, "x due today" (amber `#F6C177`) for To do.
3. **Two-column area** (wraps below ~900px):
   - Left (wide): "Recent tasks" card. Header with "View all" link to Tasks. Rows replace the old per-task Complete/Delete buttons: round checkbox (22px) to mark complete, title (16/600), description, status chip + priority chip, due date on the right with a calendar icon (amber when today).
   - Right (300px): "Overall progress" card (percent complete, a 10px stacked bar split Completed / In progress / To do in `#8FE3A8` / `#8C9EFF` / `#3A4458`, and a legend with counts), then two shortcut link cards: "Manage tasks" and "Your profile".

Remove the old "Manage Tasks" / "View Profile" big cards, they become the shortcut cards.

### 5.2 Tasks (`/tasks`)

1. **Title row:** h1 "Tasks", subtitle "{total} tasks in total, {todo} still to do.", primary "New task" button on the right.
2. **Toolbar:** search `TextField` (flex 1 1 260px, search icon adornment), status `Tabs` (All, To do, In progress, Done, each with a count), priority `Select` ("Priority: All", High, Medium, Low). Filters apply instantly. **Remove the "Apply Filters" button.**
3. **Task table** in a bordered card with horizontal scroll on narrow screens (min-width 860px). Columns: checkbox, Task (title + one-line truncated description), Status chip, Priority chip, Due, Actions (edit, delete icon buttons with aria-labels). Done tasks: filled green checkbox, title struck through and `text.secondary`. Due "—" when empty.
4. **Footer:** "Showing x of y tasks" and Previous / Next buttons.
5. **Remove the inline "Create Task" form** from this page. Creation moves to the dialog below.

### 5.3 Create task dialog

MUI `Dialog`, `maxWidth="sm"` (540px), opened from the "New task" buttons on Dashboard and Tasks. Edit uses the same dialog, title "Edit task".

- Header: h3 "New task" + subtitle "Add the details. You can change them later." + close icon button.
- Fields: Title (required, label with red asterisk), Description (multiline, 3 rows), Priority (3-option segmented control: Low / Medium / High, default Medium, selected option tinted with the priority chip colors), Due date (date picker, calendar icon).
- Actions: outlined "Cancel", primary "Create task". Disable Create until the title is filled.
- Focus the title field on open. Esc and the close button dismiss.

### 5.4 Profile (`/profile`)

`Container maxWidth={1000}`. Two columns that stack on small screens.

- Left card (280px): 88px avatar with initial, full name (display font, 24px), email, "Joined {date}" chip, and two counts (Created, Completed).
- Right column: "Account details" card with Full name input, Email input (read-only), Cancel and "Save changes" buttons. Then "Appearance" card with a Light / Dark / System segmented control (Dark is the only one that needs to work now; others can be wired to the existing toggle or left disabled).
- Replaces the old single card with the "Edit" button. Editing happens inline in the form.

---

## 6. Behavior and accessibility

- No API or data-model changes. Use existing hooks/use-cases; reuse the existing complete, edit, delete and create handlers.
- Counts, percentages and "due today" values are derived from the existing task list on the client.
- Every control is a real `button`, `a`, `input` or MUI equivalent with a visible focus state.
- Text contrast >= 4.5:1. Do not use color alone to convey status: chips always have a text label.
- Responsive: everything must work at phone width. Header wraps, stat cards and columns stack, the table scrolls horizontally.

---

## 7. Suggested order of work (one PR each)

1. Theme, fonts, `CssBaseline`, and the shared app header.
2. Dashboard.
3. Tasks page (toolbar and table) + create/edit dialog.
4. Profile.

---

## 8. Prompt to paste into Devin

> Redesign the UI of this React + MUI tasks app to match the attached screenshots (Dashboard, Tasks, Create task dialog, Profile) and the spec in `docs/design-spec.md`. This is a presentation-layer change only: keep the API, data model and clean-architecture layering as they are, and reuse existing hooks and use-cases.
>
> First, read the repo and the spec and reply with a plan: the files you'll change or add, how you'll map each screen to existing components/routes, and any places where the spec conflicts with the current code. Wait for my approval before implementing.
>
> After approval, work in this order and open one PR per step: (1) MUI theme + fonts + shared header, (2) Dashboard, (3) Tasks page + create/edit dialog, (4) Profile. Use MUI components and the theme rather than custom CSS where possible, keep existing tests passing, and add tests for new logic (filters, counts). Include before/after screenshots in each PR.
