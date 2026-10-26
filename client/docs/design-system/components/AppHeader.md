AppHeader is the top bar on every screen: logo mark and app name, main navigation, theme toggle, user pill and logout. In the app it is a custom component (not a shadcn primitive) built from `Button`, `NavLink` and a `ThemeToggle`.

**Provide:** `active` (the current page name), `mode` (`dark` or `light`, which picks the sun or moon icon and its label), `user` (full name; its first letter becomes the avatar), `appName`, `hrefs` (link per nav item, and the logo goes to Dashboard), `themeHref` (makes the theme button a link, used to flip between mockup boards), `onToggleTheme` and `onLogout`. The consumer wires the links to routes.

**Tailwind:** `bg-header border-b border-border`; active pill `bg-accent text-accent-foreground rounded-full`; inactive `text-muted-foreground`.

**Do**
- Mark the current page with the filled pill and `aria-current="page"`.
- Let the bar wrap on narrow screens instead of hiding navigation.

**Don't**
- Don't replace the logout icon with a red text button.
- Don't add more than five top-level nav links.
