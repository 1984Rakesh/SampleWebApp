import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UiButton } from './ui';

interface TaskListHeaderProps {
  onCreate: () => void;
}

export default function TaskListHeader({ onCreate }: TaskListHeaderProps) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={3}>
      <Typography variant="h4" component="h1" fontWeight={600}>
        Tasks
      </Typography>
      <UiButton variant="contained" onClick={onCreate} sx={{ flexShrink: 0 }}>
        Create Task
      </UiButton>
    </Box>
  );
}
