Dashboard "Recent tasks" row: round checkbox, title, description, status + priority chips, due date.

```jsx
<TaskRow task={task} onToggle={toggle} divider={i > 0} />
```

- Due turns amber when `dueToday`.
