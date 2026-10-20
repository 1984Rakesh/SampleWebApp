import Box from '@mui/material/Box';

interface UiPageProps {
  children: React.ReactNode;
}

export default function UiPage({ children }: UiPageProps) {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      p={2}
    >
      {children}
    </Box>
  );
}
