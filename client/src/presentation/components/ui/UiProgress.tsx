import Box from '@mui/material/Box';

interface UiProgressProps {
  completed: number;
  inProgress: number;
  todo: number;
}

export default function UiProgress({ completed, inProgress, todo }: UiProgressProps) {
  const total = completed + inProgress + todo || 1;
  return (
    <Box sx={{ display: 'flex', height: 10, overflow: 'hidden', borderRadius: 999, bgcolor: '#3A4458' }}>
      <Box sx={{ width: `${(completed / total) * 100}%`, bgcolor: '#8FE3A8' }} />
      <Box sx={{ width: `${(inProgress / total) * 100}%`, bgcolor: '#8C9EFF' }} />
    </Box>
  );
}
