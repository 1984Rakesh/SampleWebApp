import type { DashboardTaskItem } from '../models/DashboardViewState';
import { TaskRow } from '../../../components/app/TaskRow';
import { UiButton, UiCard, UiCardHeader, UiIcon, UiText } from '../../../components/ui';

interface DashboardRecentTasksProps { tasks: DashboardTaskItem[]; onToggle: (id: string) => void }

export default function DashboardRecentTasks({ tasks, onToggle }: DashboardRecentTasksProps) {
  return (
    <UiCard flush>
      <UiCardHeader
        compact
        title="Recent tasks"
        action={<UiButton to="/tasks" variant="link" size="sm" endIcon={<UiIcon name="arrow-right" size="sm" />}>View all</UiButton>}
      />
      {tasks.length === 0 ? (
        <div className="px-6 pb-6"><UiText variant="body2" tone="muted">No tasks yet. Create your first task.</UiText></div>
      ) : tasks.map((task, index) => (
        <TaskRow
          key={task.id}
          title={task.title}
          description={task.description}
          isCompleted={task.isCompleted}
          toggleAriaLabel={task.toggleAriaLabel}
          statusLabel={task.statusLabel}
          statusTone={task.statusTone}
          priorityLabel={task.priorityLabel}
          priorityTone={task.priorityTone}
          dueDateLabel={task.dueDateLabel}
          dueDateTone={task.dueDateTone}
          divider={index > 0}
          onToggle={() => onToggle(task.id)}
        />
      ))}
    </UiCard>
  );
}
