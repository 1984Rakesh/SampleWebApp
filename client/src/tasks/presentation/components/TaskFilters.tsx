import { Search } from 'lucide-react';
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, ToggleGroup, ToggleGroupItem, type SelectOption } from '../../../components/ui';
import type { TaskCountsViewState } from '../models';

const ALL_VALUE = 'all';
const toControlValue = (value: string) => value || ALL_VALUE;
const fromControlValue = (value: string) => (value === ALL_VALUE ? '' : value);

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
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-64 flex-1">
        <Label htmlFor="task-search" className="sr-only">Search tasks</Label>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input id="task-search" type="search" value={search} placeholder="Search tasks" onChange={(event) => onSearchChange(event.target.value)} className="h-9 pl-9" />
      </div>
      <ToggleGroup type="single" aria-label="Filter by status" value={toControlValue(status)} onValueChange={(value) => value && onStatusChange(fromControlValue(value))}>
        {statusOptions.map((option) => (
          <ToggleGroupItem key={option.value || ALL_VALUE} value={toControlValue(option.value)}>
            {option.label}
            <span className="text-xs text-muted-foreground tabular-nums">{countByValue[option.value] ?? 0}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="w-full sm:w-auto">
        <Label htmlFor="priority-filter" className="sr-only">Priority</Label>
        <Select value={toControlValue(priority)} onValueChange={(value) => onPriorityChange(fromControlValue(value))}>
          <SelectTrigger id="priority-filter" className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value || ALL_VALUE} value={toControlValue(option.value)}>{option.value ? option.label : 'Priority: All'}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
