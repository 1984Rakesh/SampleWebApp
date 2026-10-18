import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { UiCard, UiCardContent, UiSelect, UiButton } from './ui';
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
    <UiCard sx={{ mb: 3 }}>
      <UiCardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
          <Box flex={1}>
            <UiSelect
              id="statusFilter"
              label="Status"
              value={status}
              options={statusOptions}
              onChange={onStatusChange}
            />
          </Box>
          <Box flex={1}>
            <UiSelect
              id="priorityFilter"
              label="Priority"
              value={priority}
              options={priorityOptions}
              onChange={onPriorityChange}
            />
          </Box>
          <UiButton variant="contained" onClick={onApply} sx={{ minWidth: 140 }}>
            Apply Filters
          </UiButton>
        </Stack>
      </UiCardContent>
    </UiCard>
  );
}
