import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface UiCircularProgressProps {
  text?: string;
  size?: number;
}

export default function UiCircularProgress({ text, size = 40 }: UiCircularProgressProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
      <CircularProgress size={size} />
      {text && <Typography color="text.secondary">{text}</Typography>}
    </Box>
  );
}
