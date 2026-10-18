import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { UiCard, UiCardContent, UiChip, UiButton } from './ui';
import type { TaskItemViewState } from '../models/TaskListViewState';

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
    <UiCard>
      <UiCardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {task.title}
        </Typography>

        {task.description && (
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} mb={2}>
          <UiChip label={task.statusLabel} tone={task.statusTone} />
          <UiChip label={task.priorityLabel} tone={task.priorityTone} />
        </Stack>

        {task.dueDateLabel && (
          <Typography color="text.secondary" variant="caption" display="block" gutterBottom>
            Due: {task.dueDateLabel}
          </Typography>
        )}

        <Box display="flex" gap={1} mt={2} role="group" aria-label="Task actions">
          {onToggleStatus && (
            <UiButton
              variant="contained"
              size="small"
              fullWidth
              disabled={isLoading}
              onClick={() => onToggleStatus(task.id)}
              aria-label={task.toggleAriaLabel}
            >
              {task.toggleLabel}
            </UiButton>
          )}
          {onEdit && (
            <UiButton
              variant="outlined"
              size="small"
              fullWidth
              disabled={isLoading}
              onClick={() => onEdit(task.id)}
            >
              Edit
            </UiButton>
          )}
          {onDelete && (
            <UiButton
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              disabled={isLoading}
              onClick={() => onDelete(task.id)}
            >
              Delete
            </UiButton>
          )}
        </Box>
      </UiCardContent>
    </UiCard>
  );
}
