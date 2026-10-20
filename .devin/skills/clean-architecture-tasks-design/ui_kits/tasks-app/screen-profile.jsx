function ProfileScreen({ user, tasks, pref, setPref, onSaveName }) {
  const { Card, Avatar, Chip, TextField, Button, SegmentedControl } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const s = window.TasksKitData.stats(tasks);
  const [name, setName] = React.useState(user.name);
  React.useEffect(() => setName(user.name), [user.name]);
  const h2 = { margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' };
  const sub = { margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' };
  const count = (n, l) => <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l}</div></div>;
  return (
    <main style={{ maxWidth: 1064, margin: '0 auto', padding: '44px 32px 72px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Profile</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        <Card padding={28} style={{ flex: '1 1 280px', maxWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar name={user.name} size={88} />
          <div style={{ marginTop: 16, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>{user.name}</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>{user.email}</div>
          <Chip tone="neutral" style={{ marginTop: 12 }}>Joined {user.joined}</Chip>
          <div style={{ display: 'flex', width: '100%', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>{count(s.total, 'Created')}{count(s.done, 'Completed')}</div>
        </Card>
        <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding={24}>
            <h2 style={h2}>Account details</h2><p style={sub}>Update the name shown across the app.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 20 }}>
              <TextField label="Full name" value={name} onChange={setName} />
              <TextField label="Email" value={user.email} readOnly />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <Button variant="outlined" onClick={() => setName(user.name)}>Cancel</Button>
              <Button disabled={!name.trim() || name === user.name} onClick={() => onSaveName(name.trim())}>Save changes</Button>
            </div>
          </Card>
          <Card padding={24} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div><h2 style={h2}>Appearance</h2><p style={sub}>Choose how the app looks.</p></div>
            <SegmentedControl label="Theme" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]} value={pref} onChange={setPref} />
          </Card>
        </div>
      </div>
    </main>
  );
}
Object.assign(window, { ProfileScreen });
