import { UiCard, UiCardContent, UiChip, UiFlex, UiStack, UiText } from '../../../components/ui';
import TaskItemActions from './TaskItemActions';
import type { TaskItemViewState } from '../../models/TaskListViewState';

interface TaskMobileCardProps {
  task: TaskItemViewState;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

function TaskMobileCard({ task, onEdit, onDelete, onToggleStatus }: TaskMobileCardProps) {
  return (
    <UiCard>
      <UiCardContent compact>
        <UiFlex align="start" justify="space-between" gap={1}>
          <UiText variant="h6" as="h2" weight="semibold" breakWord>
            {task.title}
          </UiText>
          <TaskItemActions
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        </UiFlex>
        <UiText variant="caption" tone="muted" mt={1.5}>
          Due date
        </UiText>
        <UiText variant="body2" tone="muted">
          {task.dueDateLabel ?? 'No due date'}
        </UiText>
        <UiStack direction="row" spacing={1} wrap mt={2}>
          <UiChip label={task.statusLabel} tone={task.statusTone} />
          <UiChip label={task.priorityLabel} tone={task.priorityTone} />
        </UiStack>
      </UiCardContent>
    </UiCard>
  );
}

interface TaskMobileCardListProps {
  tasks: TaskItemViewState[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function TaskMobileCardList({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskMobileCardListProps) {
  return (
    <UiStack spacing={1.5}>
      {tasks.map((task) => (
        <TaskMobileCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </UiStack>
  );
}
