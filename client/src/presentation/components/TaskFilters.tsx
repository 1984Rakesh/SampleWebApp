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
    <UiCard sx={{ mb: 3, borderRadius: 2 }}>
      <UiCardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Box flex={1} width="100%">
            <UiSelect
              id="statusFilter"
              label="Status"
              value={status}
              options={statusOptions}
              onChange={onStatusChange}
              size="small"
            />
          </Box>
          <Box flex={1} width="100%">
            <UiSelect
              id="priorityFilter"
              label="Priority"
              value={priority}
              options={priorityOptions}
              onChange={onPriorityChange}
              size="small"
            />
          </Box>
          <UiButton
            variant="contained"
            onClick={onApply}
            sx={{ minWidth: 140, width: { xs: '100%', sm: 'auto' }, minHeight: 40 }}
          >
            Apply Filters
          </UiButton>
        </Stack>
      </UiCardContent>
    </UiCard>
  );
}
