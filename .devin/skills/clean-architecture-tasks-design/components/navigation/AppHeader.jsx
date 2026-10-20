import React from 'react';
import { Logo } from '../core/Logo.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { NavPill } from './NavPill.jsx';
import { UserPill } from './UserPill.jsx';
const DEFAULT_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' }, { key: 'tasks', label: 'Tasks' },
  { key: 'profile', label: 'Profile' }, { key: 'comparison', label: 'Comparison' },
];
export function AppHeader({ active = 'dashboard', items = DEFAULT_ITEMS, userName = '', theme = 'dark', onNavigate, onToggleTheme, onLogout, sticky = false, style }) {
  const go = (k) => () => onNavigate && onNavigate(k);
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <header style={{ background: 'var(--bg-header)', borderBottom: '1px solid var(--border-header)', position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 10, ...style }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 28px', padding: '12px 24px', minHeight: 64 }}>
        <Logo onClick={go('dashboard')} />
        <nav aria-label="Main" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {items.map((it) => <NavPill key={it.key} active={it.key === active} onClick={go(it.key)}>{it.label}</NavPill>)}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <IconButton icon={theme === 'dark' ? 'sun' : 'moon'} label={'Switch to ' + next + ' theme'} onClick={onToggleTheme} />
          <UserPill name={userName} onClick={go('profile')} />
          <IconButton icon="log-out" tone="danger" label="Log out" onClick={onLogout} />
        </div>
      </div>
    </header>
  );
}
