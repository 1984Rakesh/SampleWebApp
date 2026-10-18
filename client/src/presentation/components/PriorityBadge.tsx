import { TaskPriority } from '../../domain/models';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityConfig = {
    [TaskPriority.LOW]: {
      label: 'Low',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    [TaskPriority.MEDIUM]: {
      label: 'Medium',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    [TaskPriority.HIGH]: {
      label: 'High',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
  };

  const config = priorityConfig[priority] || priorityConfig[TaskPriority.MEDIUM];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
