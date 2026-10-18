import { TaskPriority, TaskStatus } from '../../domain/models';

interface TaskFiltersProps {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  onStatusChange: (status: TaskStatus | '') => void;
  onPriorityChange: (priority: TaskPriority | '') => void;
  onApply: () => void;
}

export default function TaskFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
  onApply,
}: TaskFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="statusFilter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | '')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All</option>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="priorityFilter"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | '')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All</option>
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </select>
        </div>

        <button
          onClick={onApply}
          className="ml-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors self-end"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
