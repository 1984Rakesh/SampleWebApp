function TaskDialog({ open, task, onClose, onSave }) {
  const { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button, Input, Textarea, Label, Tabs, TabsList, TabsTrigger, Icon } = window.CleanArchitectureTasksDesignSystem_40f78d;
  const [title, setTitle] = React.useState(''); const [desc, setDesc] = React.useState(''); const [prio, setPrio] = React.useState('Medium'); const [due, setDue] = React.useState('');
  React.useEffect(() => {
    if (!open) return;
    setTitle(task ? task.title : ''); setDesc(task ? task.description : ''); setPrio(task ? task.priority : 'Medium'); setDue(task && task.dueLabel ? task.dueLabel : '');
  }, [open, task]);
  const edit = !!task;
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{edit ? 'Edit task' : 'New task'}</DialogTitle><DialogDescription>Add the details. You can change them later.</DialogDescription></DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2"><Label htmlFor="task-title">Title</Label><Input id="task-title" autoFocus required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="grid gap-2"><Label htmlFor="task-desc">Description</Label><Textarea id="task-desc" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label>Priority</Label>
              <Tabs value={prio} onValueChange={setPrio}><TabsList className="w-full" aria-label="Priority">{['Low', 'Medium', 'High'].map((v) => <TabsTrigger key={v} value={v}>{v}</TabsTrigger>)}</TabsList></Tabs>
            </div>
            <div className="grid gap-2"><Label htmlFor="task-due">Due date</Label>
              <div className="relative"><Input id="task-due" placeholder="23 Oct 2026" className="pr-9" value={due} onChange={(e) => setDue(e.target.value)} /><Icon name="calendar" className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" /></div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!title.trim()} onClick={() => onSave({ title: title.trim(), description: desc.trim(), priority: prio, due })}>{edit ? 'Save changes' : 'Create task'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
Object.assign(window, { TaskDialog });
