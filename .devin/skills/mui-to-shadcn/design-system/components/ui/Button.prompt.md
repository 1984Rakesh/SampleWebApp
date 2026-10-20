shadcn Button. `default` for the main action (New task, Create task, Save changes), `outline` for Cancel / Previous / Next, `ghost` for header nav and table actions, `size="icon"` for icon-only (always add aria-label).

```jsx
<Button><Icon name="plus" />New task</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost" size="icon" aria-label="Log out"><Icon name="log-out" /></Button>
```
