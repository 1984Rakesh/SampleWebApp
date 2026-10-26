// @ds TaskTable v2026-10-20
import { Badge, Card, Checkbox, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn } from '../../../../components/ui';
import TaskItemActions from './TaskItemActions';
import type { TaskItemViewState } from '../../models';

interface TaskTableProps { tasks: TaskItemViewState[]; footer?: React.ReactNode; onEdit: (id: string) => void; onDelete: (id: string) => void; onToggleStatus: (id: string) => void }

export default function TaskTable({ tasks, footer, onEdit, onDelete, onToggleStatus }: TaskTableProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="overflow-x-auto">
        <Table aria-label="Tasks" className="min-w-[860px] table-fixed">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 pl-4"><span className="sr-only">Done</span></TableHead>
              <TableHead>Task</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-32">Priority</TableHead>
              <TableHead className="w-32">Due</TableHead>
              <TableHead className="w-24 pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="w-12 pl-4"><Checkbox checked={task.isCompleted} aria-label={task.toggleAriaLabel} onCheckedChange={() => onToggleStatus(task.id)} /></TableCell>
              <TableCell className="py-3">
                <div className="flex min-w-0 flex-col">
                  <span className={cn('truncate font-medium', task.isCompleted && 'line-through text-muted-foreground')}>{task.title}</span>
                  {task.description && <span className="truncate text-sm text-muted-foreground">{task.description}</span>}
                </div>
              </TableCell>
              <TableCell><Badge variant={task.statusVariant}>{task.statusLabel}</Badge></TableCell>
              <TableCell><Badge variant={task.priorityVariant}>{task.priorityLabel}</Badge></TableCell>
              <TableCell className={cn('text-sm', task.dueDateTone === 'amber' ? 'text-warning font-medium' : 'text-muted-foreground')}>{task.dueDateLabel ?? '—'}</TableCell>
              <TableCell className="w-24 pr-4 text-right"><TaskItemActions task={task} onEdit={onEdit} onDelete={onDelete} onToggleStatus={onToggleStatus} /></TableCell>
            </TableRow>
          ))}</TableBody>
        </Table>
      </div>
      {footer && <div className="flex items-center justify-between border-t px-6 py-3 text-sm text-muted-foreground">{footer}</div>}
    </Card>
  );
}
