import type { TaskItemViewState } from '../models/TaskListViewState';
import LoadingSpinner from './LoadingSpinner';
import TaskCard from './TaskCard';

interface TaskListContentProps {
  tasks: TaskItemViewState[];
  isLoading: boolean;
  errorMessage?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function TaskListContent({
  tasks,
  isLoading,
  errorMessage,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskListContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading tasks..." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
        Error loading tasks: {errorMessage}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        No tasks found. Create your first task!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}
