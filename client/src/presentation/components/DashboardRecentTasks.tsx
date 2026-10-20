import type { TaskItemViewState } from '../models/TaskListViewState';
import { UiCard, UiCardContent, UiCheckbox, UiChip, UiDivider, UiFlex, UiText } from '../../components/ui';

interface DashboardRecentTasksProps { tasks: TaskItemViewState[]; onToggle: (id: string) => void }

export default function DashboardRecentTasks({ tasks, onToggle }: DashboardRecentTasksProps) {
  return (
    <UiCard>
      <UiCardContent>
        <UiFlex justify="space-between" align="center" mb={1}><UiText variant="h6" as="h2" weight="bold">Recent tasks</UiText><UiText to="/tasks" tone="accent" variant="body2" weight="medium">View all →</UiText></UiFlex>
        {tasks.length === 0 ? <UiText tone="muted" mt={2}>No tasks yet. Create your first task.</UiText> : tasks.map((task, index) => (
          <div key={task.id}>
            {index > 0 && <UiDivider />}
            <UiFlex align="start" gap={1.5} py={2}>
              <UiCheckbox checked={task.isCompleted} ariaLabel={task.toggleAriaLabel} onChange={() => onToggle(task.id)} />
              <UiFlex column grow minWidth0 gap={0.5}>
                <UiText weight="semibold" breakWord>{task.title}</UiText>
                {task.description && <UiText variant="body2" tone="muted" noWrap>{task.description}</UiText>}
                <UiFlex gap={0.75} wrap><UiChip label={task.statusLabel} tone={task.statusTone} /><UiChip label={`• ${task.priorityLabel}`} tone={task.priorityTone} /></UiFlex>
              </UiFlex>
              <UiText variant="body2" tone={task.dueDateTone === 'amber' ? 'amber' : 'muted'} weight={task.dueDateTone === 'amber' ? 'semibold' : undefined} noWrap>{task.dueDateLabel ?? '—'}</UiText>
            </UiFlex>
          </div>
        ))}
      </UiCardContent>
    </UiCard>
  );
}
