import { UiCard, UiCardContent, UiSelect, UiButton, UiStack, UiFlex } from './ui';
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
  return (
    <UiCard spaced>
      <UiCardContent compact>
        <UiStack rowFrom="sm" spacing={1.5} align="center">
          <UiFlex grow>
            <UiSelect
              id="statusFilter"
              label="Status"
              value={status}
              options={statusOptions}
              onChange={onStatusChange}
              size="sm"
            />
          </UiFlex>
          <UiFlex grow>
            <UiSelect
              id="priorityFilter"
              label="Priority"
              value={priority}
              options={priorityOptions}
              onChange={onPriorityChange}
              size="sm"
            />
          </UiFlex>
          <UiButton
            variant="solid"
            onClick={onApply}
            minWidth={140}
            fullWidthBelow="sm"
          >
            Apply Filters
          </UiButton>
        </UiStack>
      </UiCardContent>
    </UiCard>
  );
}
