import { UiFlex, UiIconButton } from '../../../../components/ui';
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
    <UiFlex inline gap={0.5} role="group" ariaLabel={`Actions for ${task.title}`}>
      <UiIconButton
        icon="edit"
        ariaLabel={`Edit ${task.title}`}
        size="sm"
        tooltip="Edit"
        onClick={() => onEdit(task.id)}
      />
      <UiIconButton
        icon="delete"
        ariaLabel={`Delete ${task.title}`}
        size="sm"
        tooltip="Delete"
        destructiveHover
        onClick={() => onDelete(task.id)}
      />
    </UiFlex>
  );
}
