import { UiFlex, UiSearchField, UiSelect, UiTabs, type SelectOption } from '../../../components/ui';
import type { TaskCountsViewState } from '../models';

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
  return (
    <UiFlex wrap align="center" gap={1.5}>
      <UiSearchField value={search} onChange={onSearchChange} placeholder="Search tasks" expand />
      <UiTabs value={status} options={statusOptions} counts={countByValue} onChange={onStatusChange} ariaLabel="Filter by status" />
      <UiFlex fixedWidthFrom="sm"><UiSelect id="priority-filter" label="Priority" hideLabel value={priority} options={priorityOptions.map((option) => ({ ...option, label: option.value ? option.label : 'Priority: All' }))} onChange={onPriorityChange} /></UiFlex>
    </UiFlex>
  );
}
