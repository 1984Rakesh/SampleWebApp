import type { Task } from '../../domain/models';
import { TaskStatus } from '../../domain/models';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, status: TaskStatus) => void;
  isLoading?: boolean;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}: TaskCardProps) {
  const handleToggle = () => {
    if (onToggleStatus) {
      const nextStatus =
        task.status === TaskStatus.COMPLETED
          ? TaskStatus.TODO
          : task.status === TaskStatus.TODO
          ? TaskStatus.IN_PROGRESS
          : TaskStatus.COMPLETED;
      onToggleStatus(task.id, nextStatus);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      {task.dueDate && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <div className="flex gap-2">
        {onToggleStatus && (
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            {task.status === TaskStatus.COMPLETED ? 'Reopen' : 'Complete'}
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            disabled={isLoading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
