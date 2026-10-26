import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui';
import type { TaskItemViewState } from '../../models';

interface TaskItemActionsProps {
  task: TaskItemViewState;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function TaskItemActions({
  task,
  onEdit,
  onDelete,
}: TaskItemActionsProps) {
  return (
    <div className="inline-flex gap-1" role="group" aria-label={`Actions for ${task.title}`}>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={`Edit ${task.title}`} title="Edit" onClick={() => onEdit(task.id)}>
        <Pencil />
      </Button>
      <Button type="button" variant="ghost-destructive" size="icon-sm" aria-label={`Delete ${task.title}`} title="Delete" onClick={() => onDelete(task.id)}>
        <Trash2 />
      </Button>
    </div>
  );
}
