Labelled text input or textarea; `variant="toolbar"` for the Tasks search field.

```jsx
<TextField label="Title" required value={title} onChange={setTitle} autoFocus />
<TextField variant="toolbar" startIcon="search" placeholder="Search tasks" />
```

- `readOnly` = muted Profile email style.
- `endIcon="calendar"` for the due-date field.
