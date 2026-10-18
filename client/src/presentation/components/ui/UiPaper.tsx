import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface UiPaperProps {
  children: React.ReactNode;
  tone?: 'default' | 'dark';
  title?: string;
  action?: React.ReactNode;
}

export default function UiPaper({ children, tone = 'default', title, action }: UiPaperProps) {
  const dark = tone === 'dark';

  return (
    <Paper elevation={0} sx={{ overflow: 'hidden', ...(dark && { bgcolor: 'grey.900' }) }}>
      {title && (
        <Box
          sx={{
            bgcolor: dark ? 'grey.800' : 'action.hover',
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: dark ? 'grey.700' : 'divider',
          }}
        >
          <Typography variant="body2" fontWeight={500} color={dark ? 'grey.300' : 'text.secondary'}>
            {title}
          </Typography>
        </Box>
      )}
      <Box position="relative">
        {action && (
          <Box position="absolute" top={8} right={8}>
            {action}
          </Box>
        )}
        {children}
      </Box>
    </Paper>
  );
}
