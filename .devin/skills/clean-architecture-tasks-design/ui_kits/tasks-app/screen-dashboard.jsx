function ShortcutCard({ icon, title, subtitle, onClick }) {
  const { Card, Icon } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const [h, setH] = React.useState(false);
  return (
    <Card as="button" padding={16} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', borderColor: h ? 'var(--border-input)' : 'var(--border-card)' }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--neutral-tile)', color: 'var(--neutral-tile-text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={18} /></span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{title}</span>
        <span style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)' }}>{subtitle}</span>
      </span>
      <Icon name="chevron-right" size={16} color="var(--text-secondary)" />
    </Card>
  );
}
function DashboardScreen({ tasks, user, onToggle, onNew, go }) {
  const { Button, Card, StatCard, TaskRow, ProgressBar, Icon } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const D = window.TasksKitData; const s = D.stats(tasks);
  const recent = tasks.filter((t) => t.status !== 'Done').slice().sort((a, b) => (a.dueOffset ?? 999) - (b.dueOffset ?? 999)).slice(0, 4);
  const first = user.name.split(' ')[0];
  return (
    <main style={{ maxWidth: 1264, margin: '0 auto', padding: '44px 32px 72px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{D.eyebrow()}</div>
          <h1 style={{ margin: '10px 0 8px', fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{D.greeting()}, {first}</h1>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--text-secondary)' }}>{s.dueToday} {s.dueToday === 1 ? 'task is' : 'tasks are'} due today and {s.todo} {s.todo === 1 ? 'is' : 'are'} still to do.</p>
        </div>
        <Button startIcon="plus" onClick={onNew}>New task</Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <StatCard label="Completed" value={s.done} tone="done" caption={s.pct + '% of all tasks'} />
        <StatCard label="In progress" value={s.inprogress} tone="inprogress" caption={s.inprogressThisWeek + ' due this week'} />
        <StatCard label="To do" value={s.todo} tone="todo" caption={s.todoDueToday + ' due today'} captionTone="amber" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        <Card padding={0} style={{ flex: '1 1 520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 14px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Recent tasks</h2>
            <a href="#tasks" onClick={(e) => { e.preventDefault(); go('tasks'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--primary-soft)' }}>View all <Icon name="arrow-right" size={14} /></a>
          </div>
          {recent.map((t, i) => <TaskRow key={t.id} task={t} onToggle={onToggle} divider={i > 0} />)}
          {recent.length === 0 ? <div style={{ padding: '18px 24px 24px', color: 'var(--text-secondary)', fontSize: 14 }}>Nothing left to do.</div> : null}
        </Card>
        <div style={{ flex: '1 0 300px', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={24}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Overall progress</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '16px 0 18px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.pct}%</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>of {s.total} tasks done</span>
            </div>
            <ProgressBar legend segments={[{ label: 'Completed', value: s.done }, { label: 'In progress', value: s.inprogress }, { label: 'To do', value: s.todo }]} />
          </Card>
          <ShortcutCard icon="list" title="Manage tasks" subtitle="Create, edit and organize" onClick={() => go('tasks')} />
          <ShortcutCard icon="user" title="Your profile" subtitle="Update your details" onClick={() => go('profile')} />
        </div>
      </div>
    </main>
  );
}
Object.assign(window, { DashboardScreen, ShortcutCard });
