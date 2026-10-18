import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

interface UiAppBarProps {
  children: React.ReactNode;
}

export function UiAppBar({ children }: UiAppBarProps) {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
    >
      {children}
    </AppBar>
  );
}

interface UiToolbarProps {
  children: React.ReactNode;
}

export function UiToolbar({ children }: UiToolbarProps) {
  return <Toolbar sx={{ gap: { xs: 0.5, sm: 1 }, minWidth: 0 }}>{children}</Toolbar>;
}
