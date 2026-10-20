function TasksScreen({ tasks, onToggle, onNew, onEdit, onDelete }) {
  const { Button, Icon, Input, Tabs, TabsList, TabsTrigger, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, TaskTable } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const D = window.TasksKitData; const s = D.stats(tasks);
  const [q, setQ] = React.useState(''); const [status, setStatus] = React.useState('All'); const [prio, setPrio] = React.useState('All'); const [page, setPage] = React.useState(0);
  const PER = 8;
  const filtered = tasks.filter((t) => (status === 'All' || t.status === status) && (prio === 'All' || t.priority === prio) &&
    (!q || (t.title + ' ' + t.description).toLowerCase().includes(q.toLowerCase())));
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const p = Math.min(page, pages - 1);
  const rows = filtered.slice(p * PER, p * PER + PER);
  React.useEffect(() => setPage(0), [q, status, prio]);
  const tabs = [['All', s.total], ['To do', s.todo], ['In progress', s.inprogress], ['Done', s.done]];
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-8 pt-10 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-64 flex-1 flex-col gap-2">
          <h1 className="font-heading text-4xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">{s.total} tasks in total, {s.todo} still to do.</p>
        </div>
        <Button onClick={onNew}><Icon name="plus" />New task</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Icon name="search" className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2" />
          <Input className="pl-9" placeholder="Search tasks" aria-label="Search tasks" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList aria-label="Status">
            {tabs.map(([v, n]) => <TabsTrigger key={v} value={v} className="px-3">{v}<span className="text-muted-foreground text-xs tabular-nums">{n}</span></TabsTrigger>)}
          </TabsList>
        </Tabs>
        <Select value={prio} onValueChange={setPrio}>
          <SelectTrigger className="w-40" aria-label="Priority"><SelectValue /></SelectTrigger>
          <SelectContent align="end"><SelectItem value="All">All priorities</SelectItem><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
        </Select>
      </div>
      <TaskTable tasks={rows} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} footer={<>
        <span>Showing {rows.length} of {filtered.length} tasks</span>
        <span className="flex gap-2">
          <Button size="sm" variant="outline" disabled={p === 0} onClick={() => setPage(p - 1)}>Previous</Button>
          <Button size="sm" variant="outline" disabled={p >= pages - 1} onClick={() => setPage(p + 1)}>Next</Button>
        </span></>} />
    </main>
  );
}
Object.assign(window, { TasksScreen });
