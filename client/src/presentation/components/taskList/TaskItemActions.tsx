import { UiFlex, UiIconButton } from '../ui';
import type { UiIconName } from '../ui';
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
  onToggleStatus,
}: TaskItemActionsProps) {
  const toggleIcon: UiIconName = task.isCompleted ? 'undo' : 'check';

  return (
    <UiFlex gap={0.5} role="group" ariaLabel={`Actions for ${task.title}`}>
      <UiIconButton
        icon={toggleIcon}
        ariaLabel={task.toggleAriaLabel}
        tone={task.isCompleted ? 'default' : 'success'}
        size="sm"
        tooltip={task.toggleLabel}
        onClick={() => onToggleStatus(task.id)}
      />
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
