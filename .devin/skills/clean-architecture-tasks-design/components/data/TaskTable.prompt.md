Full tasks table in a bordered card with checkbox, chips, due, edit/delete actions and an optional footer.

```jsx
<TaskTable tasks={rows} onToggle={toggle} onEdit={edit} onDelete={del} footer={<>Showing 8 of 16 tasks …</>} />
```

- min-width 860px, scrolls horizontally on narrow screens.
- Done rows: filled checkbox, struck-through muted title.
