import type { DashboardTaskItem } from '../models/DashboardViewState';
import { ChecklistRow } from '../../../components/app/ChecklistRow';
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
        <ChecklistRow
          key={task.id}
          title={task.title}
          description={task.description}
          checked={task.isCompleted}
          toggleAriaLabel={task.toggleAriaLabel}
          chips={[
            { label: task.statusLabel, tone: task.statusTone },
            { label: `• ${task.priorityLabel}`, tone: task.priorityTone },
          ]}
          meta={task.dueDateLabel}
          metaTone={task.dueDateTone === 'amber' ? 'warning' : 'muted'}
          divider={index > 0}
          onToggle={() => onToggle(task.id)}
        />
      ))}
    </UiCard>
  );
}
