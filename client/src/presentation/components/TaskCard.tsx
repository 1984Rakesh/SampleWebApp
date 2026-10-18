import type { TaskItemViewState } from '../models/TaskListViewState';
import Badge from './Badge';

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-ios p-4 hover:shadow-ios-lg transition-all duration-200 animate-fade-in">
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
        <Badge label={task.statusLabel} tone={task.statusTone} />
        <Badge label={task.priorityLabel} tone={task.priorityTone} />
      </div>

      {task.dueDateLabel && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Due: {task.dueDateLabel}
        </p>
      )}

      <div className="flex gap-2" role="group" aria-label="Task actions">
        {onToggleStatus && (
          <button
            onClick={() => onToggleStatus(task.id)}
            disabled={isLoading}
            className="flex-1 bg-ios-blue hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={task.toggleAriaLabel}
          >
            {task.toggleLabel}
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(task.id)}
            disabled={isLoading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Edit task"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
            className="flex-1 bg-ios-red hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Delete task"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
