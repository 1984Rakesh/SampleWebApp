import { UiFlex, UiIconButton } from '../../../components/ui';
import type { TaskItemViewState } from '../../models/TaskListViewState';

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
    <UiFlex gap={0.5} role="group" ariaLabel={`Actions for ${task.title}`}>
      <UiIconButton
        icon="edit"
        ariaLabel={`Edit ${task.title}`}
        tone="info"
        size="sm"
        tooltip="Edit"
        onClick={() => onEdit(task.id)}
      />
      <UiIconButton
        icon="delete"
        ariaLabel={`Delete ${task.title}`}
        tone="danger"
        size="sm"
        tooltip="Delete"
        onClick={() => onDelete(task.id)}
      />
    </UiFlex>
  );
}
