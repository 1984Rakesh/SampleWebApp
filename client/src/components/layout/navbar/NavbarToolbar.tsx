import { NavLink } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { Button, cn } from '../../ui';
import { AppHeader, type AppHeaderLinkSlot } from '../../app';
import type { NavbarProps } from './NavbarViewState';

type Props = Pick<NavbarProps, 'view' | 'onOpenNavigation' | 'onToggleTheme' | 'onLogout' | 'onCreateTask'>;

function renderRouterLink({ href, className, activeClassName, ariaLabel, children }: AppHeaderLinkSlot) {
  return (
    <NavLink
      to={href}
      end={href === '/dashboard'}
      aria-label={ariaLabel}
      className={({ isActive }) => cn(className, isActive && activeClassName)}
    >
      {children}
    </NavLink>
  );
}

export default function NavbarToolbar({ view, onOpenNavigation, onToggleTheme, onLogout, onCreateTask }: Props) {
  return (
    <AppHeader
      appName={view.brand.label}
      brandHref={view.brand.to}
      navItems={view.links.map((link) => ({ href: link.to, label: link.label }))}
      userName={view.userName}
      userInitial={view.initial}
      userHref={view.profilePath}
      mode={view.mode}
      onToggleTheme={onToggleTheme}
      onLogout={onLogout}
      renderLink={renderRouterLink}
      leading={
        <Button type="button" variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation" onClick={onOpenNavigation}>
          <Menu aria-hidden="true" />
        </Button>
      }
      actions={
        <Button type="button" size="icon" aria-label="New task" title="New task" onClick={onCreateTask}>
          <Plus aria-hidden="true" />
        </Button>
      }
    />
  );
}
