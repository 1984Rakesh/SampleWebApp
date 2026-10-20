Single-choice segmented control: priority picker in the task dialog (tinted) and Light/Dark/System in Appearance.

```jsx
<SegmentedControl tinted fullWidth label="Priority" options={["Low","Medium","High"]} value={p} onChange={setP} />
```

- Untinted selected = white pill + subtle shadow (light) / --selected-tab (dark).
