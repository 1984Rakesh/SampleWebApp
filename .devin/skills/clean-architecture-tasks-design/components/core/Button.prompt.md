Text button for actions: primary for the main action (New task, Create task, Save changes), outlined for secondary (Cancel, Previous, Next).

```jsx
<Button startIcon="plus" onClick={openDialog}>New task</Button>
<Button variant="outlined">Cancel</Button>
```

- 12px radius, 10px 20px padding, 15px/600 DM Sans.
- `size="sm"` for table pagination.
- Disabled = 45% opacity (Create task until title is filled).
