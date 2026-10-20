Icon-only button: 40px outlined for header controls, bare 32px for table row actions and dialog close.

```jsx
<IconButton icon="log-out" tone="danger" label="Log out" />
<IconButton variant="bare" size={32} icon="pencil" label="Edit task" />
```

- Always pass `label`.
- `tone="danger"` uses --danger text and --danger-border.
