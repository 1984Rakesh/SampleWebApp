import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout';
import { useColorMode } from '../../foundation/theme';
import { ComparisonRoute } from '../../comparison';
import { DashboardRoute } from '../../dashboard';
import { ProfileRoute } from '../../profile';
import { SecurityRoute } from '../../security';
import { TasksRoute } from '../../tasks';
import { security, tasks } from './features';

const links = [
  { to: DashboardRoute.home, label: 'Dashboard' },
  { to: TasksRoute.list, label: 'Tasks' },
  { to: ProfileRoute.profile, label: 'Profile' },
  { to: ComparisonRoute.comparison, label: 'Comparison' },
];

export default function AppNavbar() {
  const { user, isAuthenticated, signOut } = security.useSession();
  const { resolvedMode, toggleMode } = useColorMode();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  if (!isAuthenticated) return null;

  const logout = () => {
    setDrawerOpen(false);
    setTaskDialogOpen(false);
    signOut();
    navigate(SecurityRoute.login);
  };

  return (
    <>
      <Navbar
        view={{
          userName: user?.name ?? '',
          initial: user?.name.trim().charAt(0).toUpperCase() || 'U',
          mode: resolvedMode,
          links,
          brand: { label: 'Clean Architecture', mark: '✓', to: DashboardRoute.home },
          profilePath: ProfileRoute.profile,
        }}
        drawerOpen={drawerOpen}
        onOpenNavigation={() => setDrawerOpen(true)}
        onCloseNavigation={() => setDrawerOpen(false)}
        onToggleTheme={toggleMode}
        onLogout={logout}
        onCreateTask={() => setTaskDialogOpen(true)}
      />
      {taskDialogOpen && <tasks.CreateTaskDialog key="navbar-create" open onClose={() => setTaskDialogOpen(false)} />}
    </>
  );
}
