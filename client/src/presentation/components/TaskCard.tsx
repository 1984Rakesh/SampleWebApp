import { UiCard, UiCardContent, UiChip, UiButton, UiFlex, UiStack, UiText } from './ui';
import type { TaskItemViewState } from '../models/TaskListViewState';

interface TaskCardProps {
  task: TaskItemViewState;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  isLoading?: boolean;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}: TaskCardProps) {
  return (
    <UiCard>
      <UiCardContent>
        <UiText variant="h6" weight="semibold" gutterBottom>
          {task.title}
        </UiText>

        {task.description && (
          <UiText tone="muted" variant="body2" gutterBottom>
            {task.description}
          </UiText>
        )}

        <UiStack direction="row" spacing={1} mb={2}>
          <UiChip label={task.statusLabel} tone={task.statusTone} />
          <UiChip label={task.priorityLabel} tone={task.priorityTone} />
        </UiStack>

        {task.dueDateLabel && (
          <UiText tone="muted" variant="caption" gutterBottom>
            Due: {task.dueDateLabel}
          </UiText>
        )}

        <UiFlex gap={1} mt={2} role="group" ariaLabel="Task actions">
          {onToggleStatus && (
            <UiButton
              variant="solid"
              size="sm"
              fullWidth
              disabled={isLoading}
              onClick={() => onToggleStatus(task.id)}
              ariaLabel={task.toggleAriaLabel}
            >
              {task.toggleLabel}
            </UiButton>
          )}
          {onEdit && (
            <UiButton
              variant="outline"
              size="sm"
              fullWidth
              disabled={isLoading}
              onClick={() => onEdit(task.id)}
            >
              Edit
            </UiButton>
          )}
          {onDelete && (
            <UiButton
              variant="outline"
              tone="danger"
              size="sm"
              fullWidth
              disabled={isLoading}
              onClick={() => onDelete(task.id)}
            >
              Delete
            </UiButton>
          )}
        </UiFlex>
      </UiCardContent>
    </UiCard>
  );
}
