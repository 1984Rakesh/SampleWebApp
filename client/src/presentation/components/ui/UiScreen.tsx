import Box from '@mui/material/Box';
import UiContainer from './UiContainer';

interface UiScreenProps {
  children: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
}

export default function UiScreen({ children, maxWidth = 'lg' }: UiScreenProps) {
  return (
    <Box
      minHeight="100vh"
      bgcolor="background.default"
      px={{ xs: 2, md: 4 }}
      py={{ xs: 2, md: 4 }}
      overflow="hidden"
    >
      <UiContainer maxWidth={maxWidth} disableGutters>
        {children}
      </UiContainer>
    </Box>
  );
}
