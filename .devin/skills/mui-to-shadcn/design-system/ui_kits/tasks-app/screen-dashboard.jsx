function ShortcutCard({ icon, title, subtitle, onClick }) {
  const { Icon } = window.CleanArchitectureTasksDesignSystem_40f78d;
  return (
    <button type="button" onClick={onClick} className="bg-card hover:bg-accent/50 flex w-full cursor-pointer items-center gap-3 rounded-xl border p-4 text-left shadow-sm transition-colors">
      <span className="bg-status-todo text-status-todo-foreground inline-flex size-9 items-center justify-center rounded-lg"><Icon name={icon} /></span>
      <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{title}</span><span className="text-muted-foreground block text-sm">{subtitle}</span></span>
      <Icon name="chevron-right" className="text-muted-foreground" />
    </button>
  );
}
function DashboardScreen({ tasks, user, onToggle, onNew, go }) {
  const { Button, Card, CardHeader, CardTitle, CardAction, CardContent, StatCard, TaskRow, TaskProgress, Icon } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const D = window.TasksKitData; const s = D.stats(tasks);
  const recent = tasks.filter((t) => t.status !== 'Done').slice().sort((a, b) => (a.dueOffset ?? 999) - (b.dueOffset ?? 999)).slice(0, 4);
  const first = user.name.split(' ')[0];
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-8 pt-10 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-64 flex-1 flex-col gap-2">
          <div className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">{D.eyebrow()}</div>
          <h1 className="font-heading text-4xl font-bold tracking-tight">{D.greeting()}, {first}</h1>
          <p className="text-muted-foreground">{s.dueToday} {s.dueToday === 1 ? 'task is' : 'tasks are'} due today and {s.todo} {s.todo === 1 ? 'is' : 'are'} still to do.</p>
        </div>
        <Button onClick={onNew}><Icon name="plus" />New task</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Completed" value={s.done} tone="done" caption={s.pct + '% of all tasks'} />
        <StatCard label="In progress" value={s.inprogress} tone="inprogress" caption={s.inprogressThisWeek + ' due this week'} />
        <StatCard label="To do" value={s.todo} tone="todo" caption={s.todoDueToday + ' due today'} captionTone="warning" />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="gap-0 py-0">
          <CardHeader className="items-center pt-5 pb-3">
            <CardTitle>Recent tasks</CardTitle>
            <CardAction><Button variant="link" size="sm" className="h-auto px-0" href="#tasks" onClick={(e) => { e.preventDefault(); go('tasks'); }}>View all<Icon name="arrow-right" /></Button></CardAction>
          </CardHeader>
          {recent.map((t, i) => <TaskRow key={t.id} task={t} onToggle={onToggle} divider={i > 0} />)}
          {recent.length === 0 ? <div className="text-muted-foreground px-6 pb-6 text-sm">Nothing left to do.</div> : null}
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Overall progress</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-baseline gap-2"><span className="font-heading text-3xl font-bold tracking-tight tabular-nums">{s.pct}%</span><span className="text-muted-foreground text-sm">of {s.total} tasks done</span></div>
              <TaskProgress segments={[{ label: 'Completed', value: s.done }, { label: 'In progress', value: s.inprogress }, { label: 'To do', value: s.todo }]} />
            </CardContent>
          </Card>
          <ShortcutCard icon="list" title="Manage tasks" subtitle="Create, edit and organize" onClick={() => go('tasks')} />
          <ShortcutCard icon="user" title="Your profile" subtitle="Update your details" onClick={() => go('profile')} />
        </div>
      </div>
    </main>
  );
}
Object.assign(window, { DashboardScreen, ShortcutCard });
