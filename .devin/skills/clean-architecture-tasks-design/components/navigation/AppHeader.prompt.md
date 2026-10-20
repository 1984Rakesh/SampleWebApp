Shared app bar on every screen: logo, Dashboard/Tasks/Profile/Comparison nav, theme toggle, user pill, logout.

```jsx
<AppHeader active="tasks" userName="Rakesh James Patole" theme={mode} onToggleTheme={toggle} onNavigate={go} />
```

- Sun icon in dark mode, moon in light.
- Wraps on small screens.
