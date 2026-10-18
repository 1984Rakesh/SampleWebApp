import type { SelectOption } from '../models/SelectOption';

interface TaskFiltersProps {
  status: string;
  priority: string;
  statusOptions: SelectOption[];
  priorityOptions: SelectOption[];
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onApply: () => void;
}

export default function TaskFilters({
  status,
  priority,
  statusOptions,
  priorityOptions,
  onStatusChange,
  onPriorityChange,
  onApply,
}: TaskFiltersProps) {
  const selectClassName =
    'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white';

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
            onChange={(e) => onStatusChange(e.target.value)}
            className={selectClassName}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="priorityFilter"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className={selectClassName}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
