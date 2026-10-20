# Tasks App UI Redesign: Design Spec (light + dark)

Target stack: React + MUI (Material UI), Node backend. This is a **UI-only** change. Do not change API contracts, domain logic or the clean-architecture layering. Only presentation-layer files change.

Reference images live in `docs/design/`: Dashboard, Tasks, Create task dialog and Profile, each in a dark and a light version (e.g. `dashboard-dark.png`, `dashboard-light.png`). Treat the images as the visual target and this file as the exact values. Layout, spacing and components are identical in both themes; only the colors differ.

---

## 1. Design direction

A refined UI with two themes.

- **Dark:** deep ink background, quiet bordered cards, one soft periwinkle accent.
- **Light:** cool off-white background, white bordered cards with a barely-there shadow, a deeper indigo accent so buttons and links keep their contrast on white.
- Priority and status are shown as color-coded chips in both themes (tinted background, readable text; the label is always present).
- Headings use Bricolage Grotesque, body uses DM Sans.
- Theme choice: Light / Dark / System. Persist the choice, and default to System when nothing is stored.

---

## 2. Tokens

### Colors

| Token | Dark | Light | Use |
|---|---|---|---|
| background.default | `#0A0D13` | `#F5F6FA` | page background |
| background.header | `#0D1118` | `#FFFFFF` | app bar |
| background.paper | `#11151D` | `#FFFFFF` | cards, table, dialog |
| background.inset | `#0D1118` | `#FFFFFF` | inputs (dark: inside cards/dialogs) |
| background.segmented | `#0D1118` | `#F0F2F7` | segmented-control track |
| border.card | `#1E2430` | `#E4E7EE` | card, dialog and table borders |
| border.subtle | `#1B212C` | `#ECEEF3` | row separators (header bottom border uses border.card in light) |
| border.input | `#2A3242` | `#CBD1DC` | input and dialog borders |
| border.control | `#232A37` | `#D9DDE7` | icon buttons, user pill, tabs/search/select outline |
| text.primary | `#ECEFF5` | `#141824` | main text |
| text.secondary | `#98A2B5` | `#5B6577` | descriptions, labels, inactive nav |
| primary.main | `#8C9EFF` | `#4655D4` | accent: buttons, logo, avatar, focus ring |
| primary.contrastText | `#0A0D13` | `#FFFFFF` | text/icons on accent |
| primary.soft | `#A9B7FF` | `#3745B8` | links, in-progress text and icons |
| danger | `#FF9E8C` | `#C23B2A` | logout, delete icon, required asterisk |
| danger.border | `#3A2A2E` | `#F0C9C3` | logout button border |
| selected.nav | `#1A2030` | `#E9ECFA` | active nav pill |
| selected.tab | `#232B3B` | `#E9ECFA` | active tab / segmented option |
| neutral.tile | `#1E2430` | `#EBEDF2` | neutral icon tile, "To do" chip bg |
| neutral.tileText | `#B5BDCC` | `#4A5468` | neutral icon and "To do" text |
| checkbox.ring | `#6B778E` | `#8A94A8` | unchecked checkbox ring (>= 3:1) |
| done | `#8FE3A8` | `#3FA663` | filled checkbox, "Completed" bar segment |
| amber.text | `#F6C177` | `#8A5A00` | "due today" text and caption |
| bar.inProgress | `#8C9EFF` | `#4655D4` | "In progress" bar segment |
| bar.todo | `#3A4458` | `#8C96AA` | "To do" bar segment |
| card.shadow | none | `0 1px 2px rgba(20,24,36,0.04)` | cards in light only |
| backdrop | MUI default | `rgba(20,24,36,0.5)` | dialog scrim |

Read-only inputs (Profile email): background `#0D1118` (dark) / `#F0F2F7` (light), border `border.card`, text `text.secondary`.

### Chip colors (text on tinted background)

| Kind | Dark text | Dark bg | Light text | Light bg |
|---|---|---|---|---|
| Priority High | `#FF9E8C` | `rgba(255,143,122,0.14)` | `#B4321F` | `#FDE8E4` |
| Priority Medium | `#F6C177` | `rgba(244,184,96,0.14)` | `#8A5A00` | `#FDF0D5` |
| Priority Low | `#7FDCCB` | `rgba(111,211,195,0.14)` | `#0B6B5E` | `#DDF3EF` |
| Status To do | `#B5BDCC` | `#1E2430` | `#4A5468` | `#EBEDF2` |
| Status In progress | `#A9B7FF` | `rgba(140,158,255,0.16)` | `#3745B8` | `#E6E9FC` |
| Status Done | `#8FE3A8` | `rgba(111,214,140,0.14)` | `#1B6B3A` | `#DDF3E4` |

Priority chips show a 6px dot in the text color before the label.

Stat-card icon tiles reuse the status chip colors: Completed = Done, In progress = In progress, To do = neutral tile.

### Typography (same in both themes)

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

### Shape and spacing (same in both themes)

- Cards: radius 18-20px, 1px border, padding 20-28px
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

## 3. MUI theme: light and dark

Put in `src/theme/` (adjust to the project's structure). One token map per mode, one `buildTheme(mode)` function, and a provider that handles Light / Dark / System.

### `tokens.ts`

```ts
export const tokens = {
  dark: {
    bg: '#0A0D13', header: '#0D1118', paper: '#11151D', inset: '#0D1118', segmented: '#0D1118',
    border: '#1E2430', borderSubtle: '#1B212C', borderInput: '#2A3242', borderControl: '#232A37',
    text: '#ECEFF5', textMuted: '#98A2B5',
    primary: '#8C9EFF', onPrimary: '#0A0D13', primarySoft: '#A9B7FF',
    danger: '#FF9E8C', dangerBorder: '#3A2A2E',
    navActive: '#1A2030', tabActive: '#232B3B',
    neutralBg: '#1E2430', neutralFg: '#B5BDCC',
    checkRing: '#6B778E', done: '#8FE3A8', amber: '#F6C177',
    barInProgress: '#8C9EFF', barTodo: '#3A4458',
    cardShadow: 'none', backdrop: undefined as string | undefined,
  },
  light: {
    bg: '#F5F6FA', header: '#FFFFFF', paper: '#FFFFFF', inset: '#FFFFFF', segmented: '#F0F2F7',
    border: '#E4E7EE', borderSubtle: '#ECEEF3', borderInput: '#CBD1DC', borderControl: '#D9DDE7',
    text: '#141824', textMuted: '#5B6577',
    primary: '#4655D4', onPrimary: '#FFFFFF', primarySoft: '#3745B8',
    danger: '#C23B2A', dangerBorder: '#F0C9C3',
    navActive: '#E9ECFA', tabActive: '#E9ECFA',
    neutralBg: '#EBEDF2', neutralFg: '#4A5468',
    checkRing: '#8A94A8', done: '#3FA663', amber: '#8A5A00',
    barInProgress: '#4655D4', barTodo: '#8C96AA',
    cardShadow: '0 1px 2px rgba(20,24,36,0.04)', backdrop: 'rgba(20,24,36,0.5)',
  },
} as const;

export const chipColors = {
  dark: {
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
  },
  light: {
    priority: {
      High:   { fg: '#B4321F', bg: '#FDE8E4' },
      Medium: { fg: '#8A5A00', bg: '#FDF0D5' },
      Low:    { fg: '#0B6B5E', bg: '#DDF3EF' },
    },
    status: {
      'To do':       { fg: '#4A5468', bg: '#EBEDF2' },
      'In progress': { fg: '#3745B8', bg: '#E6E9FC' },
      Done:          { fg: '#1B6B3A', bg: '#DDF3E4' },
    },
  },
} as const;
```

### `theme.ts`

```ts
import { createTheme, useTheme, type PaletteMode } from '@mui/material/styles';
import { tokens, chipColors } from './tokens';

const display = "'Bricolage Grotesque', 'DM Sans', sans-serif";
const body = "'DM Sans', system-ui, sans-serif";

export const buildTheme = (mode: PaletteMode) => {
  const t = tokens[mode];
  return createTheme({
    palette: {
      mode,
      primary: { main: t.primary, contrastText: t.onPrimary },
      error: { main: t.danger },
      success: { main: t.done },
      warning: { main: t.amber },
      background: { default: t.bg, paper: t.paper },
      text: { primary: t.text, secondary: t.textMuted },
      divider: t.border,
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
      MuiCssBaseline: { styleOverrides: { body: { backgroundColor: t.bg } } },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'default' },
        styleOverrides: {
          root: { backgroundColor: t.header, backgroundImage: 'none', borderBottom: `1px solid ${mode === 'dark' ? t.borderSubtle : t.border}` },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: { backgroundColor: t.paper, borderColor: t.border, borderRadius: 20, boxShadow: t.cardShadow },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 12, padding: '10px 20px' },
          outlined: { borderColor: t.borderInput, color: t.text },
        },
      },
      MuiChip: {
        styleOverrides: { root: { height: 24, fontSize: 12, fontWeight: 500, borderRadius: 999 } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: t.inset,
            borderRadius: 12,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: t.borderInput },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: t.primary, borderWidth: 1.5 },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { backgroundColor: t.paper, border: `1px solid ${mode === 'dark' ? t.borderInput : t.border}`, borderRadius: 24, padding: 8 },
        },
      },
      MuiBackdrop: {
        styleOverrides: { root: t.backdrop ? { backgroundColor: t.backdrop } : {} },
      },
      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 0, backgroundColor: t.paper, border: `1px solid ${t.borderControl}`, borderRadius: 12, padding: 4 },
          indicator: { display: 'none' },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 34, borderRadius: 9, textTransform: 'none', fontWeight: 500, color: t.textMuted,
            '&.Mui-selected': { backgroundColor: t.tabActive, color: t.text },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottom: `1px solid ${t.borderSubtle}` },
          head: { fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMuted },
        },
      },
    },
  });
};

// Use in components for chips, status tiles, bar segments, etc.
export const useChipColors = () => chipColors[useTheme().palette.mode];
export const useTokens = () => tokens[useTheme().palette.mode];
```

### `AppThemeProvider.tsx` (Light / Dark / System)

```tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { buildTheme } from './theme';

export type ColorModePref = 'light' | 'dark' | 'system';
const KEY = 'color-mode';

const Ctx = createContext<{ pref: ColorModePref; setPref: (p: ColorModePref) => void; toggle: () => void }>({
  pref: 'system', setPref: () => {}, toggle: () => {},
});
export const useColorMode = () => useContext(Ctx);

const readPref = (): ColorModePref => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
  } catch {
    return 'system';
  }
};

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ColorModePref>(readPref);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const mode = pref === 'system' ? (prefersDark ? 'dark' : 'light') : pref;
  const theme = useMemo(() => buildTheme(mode), [mode]);

  const setPref = (p: ColorModePref) => {
    setPrefState(p);
    try { localStorage.setItem(KEY, p); } catch { /* storage unavailable */ }
  };
  const toggle = () => setPref(mode === 'dark' ? 'light' : 'dark');

  return (
    <Ctx.Provider value={{ pref, setPref, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Ctx.Provider>
  );
}
```

Wrap the app root in `AppThemeProvider` (replacing the existing `ThemeProvider`/theme-toggle logic if there is one; reuse what exists where it already does the same job). Remove hard-coded colors from components in favor of the theme and `useTokens()` / `useChipColors()`.

---

## 4. Shared app header (all screens)

MUI `AppBar` (elevation 0) with a `Toolbar`, flex-wrap on small screens.

- Left: logo mark (32px rounded-square, `primary.main`, check icon in `primary.contrastText`) + "Clean Architecture" in the display font (19px, 700). Click goes to Dashboard.
- Nav: Dashboard, Tasks, Profile, Comparison. Pill-shaped links (radius 999, 8px 14px padding, 14px/500). Active = `selected.nav` background and `text.primary`; inactive = `text.secondary`. Use `NavLink` and its active state.
- Right: theme toggle `IconButton` (40px, 12px radius, 1px `border.control` border; sun icon in dark mode, moon icon in light mode; calls `toggle()`; `aria-label` says which theme it switches to), a user pill (avatar 32px with initial + full name, 1px `border.control` border, links to Profile), and a logout `IconButton` in `danger` with `danger.border`.
- Replace the current red "Logout" text button with the icon button. Give it `aria-label="Log out"`.
- All icon-only buttons need `aria-label`.

---

## 5. Screens

Colors below refer to the token names in section 2, so they apply to both themes.

### 5.1 Dashboard (`/dashboard`)

Content: `Container maxWidth={1200}`, padding 44px 32px 72px, 32px vertical gap.

1. **Hero row:** eyebrow with today's date (uppercase), h1 "Good evening, {firstName}" (greeting by time of day), subtitle "{n} task(s) due today and {m} still to do." Right side: primary `Button` "New task" with plus icon, opens the create-task dialog.
2. **Stat cards:** three cards in a flex-wrap row (`flex: 1 1 240px`): Completed, In progress, To do. Each has the label, a 36px tinted icon tile, a 48px number and a caption. Tile colors come from the status chip colors (Done / In progress / neutral). Captions: share of total for Completed, "x due this week" for In progress, "x due today" (`amber.text`) for To do.
3. **Two-column area** (wraps below ~900px):
   - Left (wide): "Recent tasks" card. Header with "View all" link to Tasks (`primary.soft`). Rows replace the old per-task Complete/Delete buttons: round checkbox (22px, `checkbox.ring`) to mark complete, title (16/600), description, status chip + priority chip, due date on the right with a calendar icon (`amber.text` when today).
   - Right (300px): "Overall progress" card (percent complete, a 10px stacked bar split Completed / In progress / To do using `done` / `bar.inProgress` / `bar.todo`, and a legend with counts), then two shortcut link cards: "Manage tasks" and "Your profile".

Remove the old "Manage Tasks" / "View Profile" big cards, they become the shortcut cards.

### 5.2 Tasks (`/tasks`)

1. **Title row:** h1 "Tasks", subtitle "{total} tasks in total, {todo} still to do.", primary "New task" button on the right.
2. **Toolbar:** search `TextField` (flex 1 1 260px, search icon adornment), status `Tabs` (All, To do, In progress, Done, each with a count), priority `Select` ("Priority: All", High, Medium, Low). Filters apply instantly. **Remove the "Apply Filters" button.**
3. **Task table** in a bordered card with horizontal scroll on narrow screens (min-width 860px). Columns: checkbox, Task (title + one-line truncated description), Status chip, Priority chip, Due, Actions (edit, delete icon buttons with aria-labels). Done tasks: filled `done` checkbox with a check mark (white `#FFFFFF` in light, `#0A0D13` in dark), title struck through and `text.secondary`. Due "—" when empty.
4. **Footer:** "Showing x of y tasks" and Previous / Next buttons.
5. **Remove the inline "Create Task" form** from this page. Creation moves to the dialog below.

### 5.3 Create task dialog

MUI `Dialog`, `maxWidth="sm"` (540px), opened from the "New task" buttons on Dashboard and Tasks. Edit uses the same dialog, title "Edit task".

- Header: h3 "New task" + subtitle "Add the details. You can change them later." + close icon button.
- Fields: Title (required, label with `danger` asterisk), Description (multiline, 3 rows), Priority (3-option segmented control: Low / Medium / High, default Medium, selected option tinted with the priority chip colors, track uses `background.segmented`), Due date (date picker, calendar icon).
- Actions: outlined "Cancel", primary "Create task". Disable Create until the title is filled.
- Focus the title field on open. Esc and the close button dismiss.

### 5.4 Profile (`/profile`)

`Container maxWidth={1000}`. Two columns that stack on small screens.

- Left card (280px): 88px avatar with initial, full name (display font, 24px), email, "Joined {date}" chip (neutral tile colors), and two counts (Created, Completed).
- Right column: "Account details" card with Full name input, Email input (read-only), Cancel and "Save changes" buttons. Then "Appearance" card with a Light / Dark / System segmented control wired to `setPref` from `useColorMode()`; the selected option shows `pref`, and the header toggle keeps it in sync. In light mode the selected option is a white pill with a subtle shadow on the `background.segmented` track; in dark mode it uses `selected.tab`.
- Replaces the old single card with the "Edit" button. Editing happens inline in the form.

---

## 6. Behavior and accessibility

- No API or data-model changes. Use existing hooks/use-cases; reuse the existing complete, edit, delete and create handlers.
- Counts, percentages and "due today" values are derived from the existing task list on the client.
- Theme preference persists in `localStorage` under `color-mode` (wrap access in try/catch) and defaults to System.
- Every control is a real `button`, `a`, `input` or MUI equivalent with a visible focus state.
- Text contrast >= 4.5:1 in both themes (the light palette values above are chosen to meet it). Do not use color alone to convey status: chips always have a text label.
- Responsive: everything must work at phone width. Header wraps, stat cards and columns stack, the table scrolls horizontally.

---

## 7. Suggested order of work (one PR each)

1. Tokens, light + dark theme, `AppThemeProvider`, fonts, and the shared app header with the theme toggle.
2. Dashboard.
3. Tasks page (toolbar and table) + create/edit dialog.
4. Profile (including the Appearance control).

Check each screen in both themes before opening its PR.

---

## 8. Prompt to paste into Devin

> Redesign the UI of this React + MUI tasks app to match the attached screenshots (Dashboard, Tasks, Create task dialog, Profile, each in dark and light) and the spec in `docs/design-spec.md`. This is a presentation-layer change only: keep the API, data model and clean-architecture layering as they are, and reuse existing hooks and use-cases. The app must support both a light and a dark theme (Light / Dark / System, persisted, default System) using the token maps and theme code in the spec.
>
> First, read the repo and the spec and reply with a plan: the files you'll change or add, how you'll map each screen to existing components/routes, how you'll fit the theme provider into the existing theme/toggle code, and any places where the spec conflicts with the current code. Wait for my approval before implementing.
>
> After approval, work in this order and open one PR per step: (1) tokens + light/dark MUI theme + provider + fonts + shared header, (2) Dashboard, (3) Tasks page + create/edit dialog, (4) Profile. Use MUI components and the theme rather than custom CSS where possible, never hard-code hex colors in components, keep existing tests passing, and add tests for new logic (filters, counts, theme preference). Include before/after screenshots in both themes in each PR.
