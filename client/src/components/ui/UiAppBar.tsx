import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

interface UiAppBarProps {
  children: React.ReactNode;
}

export function UiAppBar({ children }: UiAppBarProps) {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
    >
      {children}
    </AppBar>
  );
}

interface UiToolbarProps {
  children: React.ReactNode;
}

export function UiToolbar({ children }: UiToolbarProps) {
  return <Toolbar sx={{ gap: { xs: 0.5, sm: 1 }, minWidth: 0, minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 3 } }}>{children}</Toolbar>;
}
