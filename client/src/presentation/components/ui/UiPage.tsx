import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

export default function UiPage(props: BoxProps) {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      p={2}
      {...props}
    />
  );
}
