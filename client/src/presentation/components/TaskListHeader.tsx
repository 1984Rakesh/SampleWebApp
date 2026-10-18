import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UiButton } from './ui';

interface TaskListHeaderProps {
  onCreate: () => void;
}

export default function TaskListHeader({ onCreate }: TaskListHeaderProps) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        Tasks
      </Typography>
      <UiButton variant="contained" onClick={onCreate}>
        Create Task
      </UiButton>
    </Box>
  );
}
