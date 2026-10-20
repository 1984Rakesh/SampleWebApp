import { UiFlex, UiSearchField, UiSelect, UiStack, UiTabs } from '../../../components/ui';
import type { SelectOption } from '../../../components/ui/SelectOption';
import type { TaskCountsViewState } from '../models/TaskListViewState';

interface TaskFiltersProps {
  search: string;
  status: string;
  priority: string;
  counts: TaskCountsViewState;
  total: number;
  statusOptions: SelectOption[];
  priorityOptions: SelectOption[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export default function TaskFilters({ search, status, priority, counts, total, statusOptions, priorityOptions, onSearchChange, onStatusChange, onPriorityChange }: TaskFiltersProps) {
  const countByValue: Record<string, number> = { '': total, TODO: counts.todo, IN_PROGRESS: counts.inProgress, COMPLETED: counts.completed };
  const countedStatuses = statusOptions.map((option) => ({ ...option, label: `${option.label} ${countByValue[option.value] ?? 0}` }));
  return (
    <UiStack rowFrom="md" spacing={1.5} align="center">
      <UiFlex grow><UiSearchField value={search} onChange={onSearchChange} placeholder="Search tasks" /></UiFlex>
      <UiTabs value={status} options={countedStatuses} onChange={onStatusChange} ariaLabel="Filter by status" />
      <UiSelect id="priority-filter" label="Priority" value={priority} options={priorityOptions.map((option) => ({ ...option, label: option.value ? option.label : 'Priority: All' }))} onChange={onPriorityChange} size="sm" />
    </UiStack>
  );
}
