interface TaskListHeaderProps { total: number; todo: number }

export default function TaskListHeader({ total, todo }: TaskListHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-display text-[42px] leading-[46px] font-bold tracking-tight">Tasks</h1>
      <p className="text-muted-foreground">{total} tasks in total, {todo} still to do.</p>
    </div>
  );
}
