Modal dialog (540px, 24px radius) for New task / Edit task; Esc, backdrop and close button dismiss.

```jsx
<Dialog open={open} onClose={close} title="New task" subtitle="Add the details. You can change them later." actions={<><Button variant="outlined" onClick={close}>Cancel</Button><Button>Create task</Button></>}>…fields…</Dialog>
```

- `contained` positions it inside the nearest relative parent (for previews).
