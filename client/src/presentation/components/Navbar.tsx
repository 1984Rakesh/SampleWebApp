import { useState } from 'react';
import { useColorMode } from '../../foundation/theme';
import { useAuthViewModel } from '../hooks';
import {
  UiAppBar,
  UiAvatar,
  UiButton,
  UiDivider,
  UiDrawer,
  UiFlex,
  UiIcon,
  UiIconButton,
  UiNavList,
  UiResponsive,
  UiText,
  UiToolbar,
} from './ui';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/profile', label: 'Profile' },
  { to: '/comparison', label: 'Comparison' },
];

export default function Navbar() {
  const { userName, logout, isAuthenticated } = useAuthViewModel();
  const { mode, toggleMode } = useColorMode();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <UiAppBar>
        <UiToolbar>
          <UiIconButton
            icon="menu"
            ariaLabel="Open navigation"
            onClick={() => setDrawerOpen(true)}
            hideFrom="md"
          />

          <UiFlex grow align="center" minWidth0>
            <UiText
              variant="h6"
              to="/dashboard"
              tone="accent"
              weight="bold"
              noWrap
            >
              <UiResponsive display="inline" hideBelow="sm">Clean Architecture</UiResponsive>
              <UiResponsive display="inline" hideFrom="sm">CA</UiResponsive>
            </UiText>

            <UiResponsive display="flex" hideBelow="md">
              <UiFlex grow gap={0.5} ml={3}>
                {navLinks.map((link) => (
                  <UiButton key={link.to} to={link.to}>
                    {link.label}
                  </UiButton>
                ))}
              </UiFlex>
            </UiResponsive>
          </UiFlex>

          <UiFlex align="center" gap={1}>
            <UiIconButton
              icon={mode === 'light' ? 'theme-dark' : 'theme-light'}
              ariaLabel="Toggle theme"
              tooltip={mode === 'light' ? 'Use dark theme' : 'Use light theme'}
              onClick={toggleMode}
            />
            <UiAvatar
              label={userName?.trim().charAt(0).toUpperCase() || 'U'}
              size="sm"
              tone="primary"
              variant="solid"
              tooltip={userName ?? 'User'}
            />
            <UiResponsive hideBelow="lg">
              <UiText variant="body2" tone="muted" noWrap maxWidth={160}>
                {userName}
              </UiText>
            </UiResponsive>
            <UiResponsive display="inline-flex" hideBelow="md">
              <UiButton
                variant="solid"
                tone="danger"
                onClick={handleLogout}
                startIcon={<UiIcon name="logout" />}
              >
                Logout
              </UiButton>
            </UiResponsive>
          </UiFlex>
        </UiToolbar>
      </UiAppBar>

      <UiDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <UiFlex column p={2.5}>
          <UiText variant="h6" weight="semibold">Navigation</UiText>
          <UiText variant="body2" tone="muted" noWrap>{userName}</UiText>
        </UiFlex>
        <UiDivider />
        <UiNavList
          items={navLinks.map((link) => ({
            label: link.label,
            to: link.to,
            onClick: () => setDrawerOpen(false),
          }))}
        />
        <UiFlex column mt="auto">
          <UiDivider />
          <UiNavList
            items={[{ label: 'Logout', icon: 'logout', tone: 'danger', onClick: handleLogout }]}
          />
        </UiFlex>
      </UiDrawer>
    </>
  );
}
