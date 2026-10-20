function TasksScreen({ tasks, onToggle, onNew, onEdit, onDelete }) {
  const { Button, TextField, Tabs, Select, TaskTable } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const D = window.TasksKitData; const s = D.stats(tasks);
  const [q, setQ] = React.useState(''); const [status, setStatus] = React.useState('All'); const [prio, setPrio] = React.useState('All'); const [page, setPage] = React.useState(0);
  const PER = 8;
  const filtered = tasks.filter((t) => (status === 'All' || t.status === status) && (prio === 'All' || t.priority === prio) &&
    (!q || (t.title + ' ' + t.description).toLowerCase().includes(q.toLowerCase())));
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const p = Math.min(page, pages - 1);
  const rows = filtered.slice(p * PER, p * PER + PER);
  React.useEffect(() => setPage(0), [q, status, prio]);
  return (
    <main style={{ maxWidth: 1264, margin: '0 auto', padding: '44px 32px 72px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Tasks</h1>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--text-secondary)' }}>{s.total} tasks in total, {s.todo} still to do.</p>
        </div>
        <Button startIcon="plus" onClick={onNew}>New task</Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <TextField variant="toolbar" startIcon="search" placeholder="Search tasks" aria-label="Search tasks" value={q} onChange={setQ} style={{ flex: '1 1 260px' }} />
        <Tabs label="Status" value={status} onChange={setStatus} items={[
          { value: 'All', label: 'All', count: s.total }, { value: 'To do', label: 'To do', count: s.todo },
          { value: 'In progress', label: 'In progress', count: s.inprogress }, { value: 'Done', label: 'Done', count: s.done }]} />
        <Select label="Priority" value={prio} onChange={setPrio} options={[{ value: 'All', label: 'Priority: All' }, 'High', 'Medium', 'Low']} />
      </div>
      <TaskTable tasks={rows} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} footer={<>
        <span>Showing {rows.length} of {filtered.length} tasks</span>
        <span style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outlined" disabled={p === 0} onClick={() => setPage(p - 1)}>Previous</Button>
          <Button size="sm" variant="outlined" disabled={p >= pages - 1} onClick={() => setPage(p + 1)}>Next</Button>
        </span></>} />
    </main>
  );
}
Object.assign(window, { TasksScreen });
