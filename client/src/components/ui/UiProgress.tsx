import Box from '@mui/material/Box';

interface UiProgressProps {
  completed: number;
  inProgress: number;
  todo: number;
}

export default function UiProgress({ completed, inProgress, todo }: UiProgressProps) {
  const total = completed + inProgress + todo || 1;
  return (
    <Box sx={(theme) => {
      const dark = theme.palette.mode === 'dark';
      return { display: 'flex', height: 10, overflow: 'hidden', borderRadius: 999, bgcolor: dark ? '#3A4458' : '#8C96AA' };
    }}>
      <Box sx={{ width: `${(completed / total) * 100}%`, bgcolor: 'success.main' }} />
      <Box sx={{ width: `${(inProgress / total) * 100}%`, bgcolor: 'primary.main' }} />
    </Box>
  );
}
