import React from 'react';
import { cn } from '../ui/utils.js';
import { Icon } from '../ui/Icon.jsx';
import { Button } from '../ui/Button.jsx';
import { Avatar, AvatarFallback } from '../ui/Avatar.jsx';
import { Logo } from './Logo.jsx';
const DEFAULT_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' }, { key: 'tasks', label: 'Tasks' },
  { key: 'profile', label: 'Profile' }, { key: 'comparison', label: 'Comparison' },
];
const initials = (n) => (n || '').split(' ').filter(Boolean).map((w) => w[0]).filter((_, i, a) => i === 0 || i === a.length - 1).join('').toUpperCase();
export function AppHeader({ active = 'dashboard', items = DEFAULT_ITEMS, userName = '', theme = 'dark', onNavigate, onToggleTheme, onLogout, sticky = false, className }) {
  const go = (k) => () => onNavigate && onNavigate(k);
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <header data-slot="app-header" className={cn('bg-background border-b', sticky && 'sticky top-0 z-40', className)}>
      <div className="flex min-h-16 flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
        <Logo onClick={go('dashboard')} />
        <nav aria-label="Main" className="flex flex-wrap items-center gap-1">
          {items.map((it) => (
            <Button key={it.key} variant="ghost" size="sm" aria-current={it.key === active ? 'page' : undefined} onClick={go(it.key)}
              className={cn('text-muted-foreground', it.key === active && 'bg-accent text-accent-foreground')}>{it.label}</Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" aria-label={'Switch to ' + next + ' theme'} onClick={onToggleTheme}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></Button>
          <Button variant="outline" className="h-9 gap-2 rounded-full pr-3 pl-1" aria-label={'Profile: ' + userName} onClick={go('profile')}>
            <Avatar className="size-7"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials(userName)}</AvatarFallback></Avatar>
            <span>{userName}</span>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Log out" className="text-destructive hover:text-destructive" onClick={onLogout}><Icon name="log-out" /></Button>
        </div>
      </div>
    </header>
  );
}
