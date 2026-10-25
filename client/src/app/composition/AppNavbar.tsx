import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useColorMode } from '../../foundation/theme';
import { useAuth } from '../../security/presentation/context';
import { TaskDialog } from '../../tasks/presentation/components';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/profile', label: 'Profile' },
  { to: '/comparison', label: 'Comparison' },
];

export default function AppNavbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { resolvedMode, toggleMode } = useColorMode();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  if (!isAuthenticated) return null;

  const logout = () => {
    setDrawerOpen(false);
    setTaskDialogOpen(false);
    signOut();
    navigate('/login');
  };

  return (
    <>
      <Navbar
        view={{
          userName: user?.name ?? '',
          initial: user?.name.trim().charAt(0).toUpperCase() || 'U',
          mode: resolvedMode,
          links,
          brand: { label: 'Clean Architecture', mark: '✓', to: '/dashboard' },
          profilePath: '/profile',
        }}
        drawerOpen={drawerOpen}
        onOpenNavigation={() => setDrawerOpen(true)}
        onCloseNavigation={() => setDrawerOpen(false)}
        onToggleTheme={toggleMode}
        onLogout={logout}
        onCreateTask={() => setTaskDialogOpen(true)}
      />
      {taskDialogOpen && <TaskDialog key="navbar-create" open onClose={() => setTaskDialogOpen(false)} />}
    </>
  );
}
