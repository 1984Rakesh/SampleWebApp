import { TaskStatus } from '../../domain/models';

interface StatusBadgeProps {
  status: TaskStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    [TaskStatus.TODO]: {
      label: 'To Do',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
    [TaskStatus.IN_PROGRESS]: {
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    [TaskStatus.COMPLETED]: {
      label: 'Completed',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
  };

  const config = statusConfig[status] || statusConfig[TaskStatus.TODO];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
