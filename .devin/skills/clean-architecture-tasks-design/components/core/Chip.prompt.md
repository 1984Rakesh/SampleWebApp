Tinted 24px pill for task status and priority; priority chips carry a 6px dot.

```jsx
<Chip status="In progress" />
<Chip priority="High" />
<Chip tone="neutral">Joined 18 Oct 2026</Chip>
```

- Pass `priority` or `status` and the label + colors are derived.
- `tone="neutral"` for metadata chips.
