shadcn Select composition.

```jsx
<Select value={p} onValueChange={setP}>
  <SelectTrigger className="w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
  <SelectContent><SelectItem value="All">All priorities</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
</Select>
```
