function TaskDialog({ open, task, onClose, onSave }) {
  const { Dialog, Button, TextField, SegmentedControl } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const [title, setTitle] = React.useState(''); const [desc, setDesc] = React.useState(''); const [prio, setPrio] = React.useState('Medium'); const [due, setDue] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    setTitle(task ? task.title : ''); setDesc(task ? task.description : ''); setPrio(task ? task.priority : 'Medium'); setDue(task && task.dueLabel ? task.dueLabel : '');
    setTimeout(() => ref.current && ref.current.focus(), 30);
  }, [open, task]);
  const edit = !!task;
  return (
    <Dialog open={open} onClose={onClose} title={edit ? 'Edit task' : 'New task'} subtitle="Add the details. You can change them later."
      actions={<><Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button disabled={!title.trim()} onClick={() => onSave({ title: title.trim(), description: desc.trim(), priority: prio, due })}>{edit ? 'Save changes' : 'Create task'}</Button></>}>
      <TextField label="Title" required value={title} onChange={setTitle} inputRef={ref} />
      <TextField label="Description" multiline rows={3} value={desc} onChange={setDesc} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Priority</span>
          <SegmentedControl tinted fullWidth label="Priority" options={['Low', 'Medium', 'High']} value={prio} onChange={setPrio} />
        </div>
        <TextField label="Due date" placeholder="23 Oct 2026" value={due} onChange={setDue} endIcon="calendar" />
      </div>
    </Dialog>
  );
}
Object.assign(window, { TaskDialog });
