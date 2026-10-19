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
  UiIconButton,
  UiNavButton,
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
  const initial = userName?.trim().charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <UiAppBar>
        <UiToolbar>
          <UiIconButton icon="menu" ariaLabel="Open navigation" onClick={() => setDrawerOpen(true)} hideFrom="md" />
          <UiFlex grow align="center" minWidth0 gap={1}>
            <UiButton to="/dashboard" ariaLabel="Go to Dashboard" noShrink>
              <UiFlex align="center" gap={1}>
                <UiAvatar label="✓" size="sm" tone="primary" variant="solid" />
                <UiResponsive display="inline" hideBelow="sm">
                  <UiText variant="h6" weight="bold" noWrap>Clean Architecture</UiText>
                </UiResponsive>
              </UiFlex>
            </UiButton>
            <UiResponsive display="flex" hideBelow="md">
              <UiFlex gap={0.5} ml={1}>
                {navLinks.map((link) => <UiNavButton key={link.to} to={link.to}>{link.label}</UiNavButton>)}
              </UiFlex>
            </UiResponsive>
          </UiFlex>
          <UiFlex align="center" gap={1}>
            <UiIconButton
              icon={mode === 'light' ? 'theme-dark' : 'theme-light'}
              ariaLabel="Toggle theme"
              tooltip={mode === 'light' ? 'Use dark theme' : 'Use light theme'}
              onClick={toggleMode}
              bordered
            />
            <UiResponsive display="flex" hideBelow="md">
              <UiButton to="/profile" variant="outline" ariaLabel="Open profile">
                <UiFlex align="center" gap={1}>
                  <UiAvatar label={initial} size="sm" tone="primary" variant="solid" />
                  <UiText variant="body2" weight="medium" noWrap maxWidth={180}>{userName}</UiText>
                </UiFlex>
              </UiButton>
            </UiResponsive>
            <UiIconButton icon="logout" ariaLabel="Log out" tooltip="Log out" onClick={handleLogout} tone="danger" bordered />
          </UiFlex>
        </UiToolbar>
      </UiAppBar>
      <UiDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <UiFlex column p={2.5} gap={0.5}>
          <UiText variant="h6" weight="semibold">Navigation</UiText>
          <UiText variant="body2" tone="muted" noWrap>{userName}</UiText>
        </UiFlex>
        <UiDivider />
        <UiNavList items={navLinks.map((link) => ({ ...link, onClick: () => setDrawerOpen(false) }))} />
      </UiDrawer>
    </>
  );
}
