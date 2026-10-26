// @ds AppHeader v2026-10-20
import type { ReactNode } from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';
import { Button, cn } from '../ui';
import { Logo } from './Logo';

export interface AppHeaderNavItem {
  href: string;
  label: string;
  active?: boolean;
}

export interface AppHeaderLinkSlot {
  href: string;
  className: string;
  activeClassName?: string;
  ariaLabel?: string;
  active?: boolean;
  children: ReactNode;
}

/** Top bar: logo, main navigation, theme toggle, user pill and logout. Links render through `renderLink` so the header stays router-agnostic. */
export interface AppHeaderProps {
  appName: string;
  brandHref: string;
  navItems: AppHeaderNavItem[];
  userName: string;
  userInitial: string;
  userHref: string;
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  renderLink?: (link: AppHeaderLinkSlot) => ReactNode;
  leading?: ReactNode;
  actions?: ReactNode;
}

const navLinkClass = 'inline-flex min-w-0 items-center rounded-full px-3.5 py-2 text-sm leading-5 font-medium text-muted-foreground no-underline outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
const navLinkActiveClass = 'bg-accent text-accent-foreground';

function defaultLink({ href, className, activeClassName, ariaLabel, active, children }: AppHeaderLinkSlot) {
  return (
    <a href={href} className={cn(className, active && activeClassName)} aria-label={ariaLabel} aria-current={active ? 'page' : undefined}>
      {children}
    </a>
  );
}

export function AppHeader({
  appName, brandHref, navItems, userName, userInitial, userHref, mode, onToggleTheme, onLogout, renderLink = defaultLink, leading, actions,
}: AppHeaderProps) {
  const themeLabel = mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
  const ThemeIcon = mode === 'light' ? Moon : Sun;
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border bg-header px-4 py-3.5 text-foreground sm:px-8">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-3 md:gap-x-8">
        {leading}
        {renderLink({
          href: brandHref,
          className: 'inline-flex rounded-md no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          ariaLabel: 'Go to Dashboard',
          children: <Logo name={appName} hideWordmarkBelow="sm" />,
        })}
        <nav aria-label="Main" className="hidden flex-wrap gap-1 md:flex">
          {navItems.map((item) => (
            <span key={item.href} className="inline-flex">
              {renderLink({ href: item.href, className: navLinkClass, activeClassName: navLinkActiveClass, active: item.active, children: item.label })}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button type="button" variant="outline" size="icon" aria-label="Toggle theme" title={themeLabel} onClick={onToggleTheme}>
          <ThemeIcon aria-hidden="true" />
        </Button>
        <span className="hidden md:inline-flex">
          {renderLink({
            href: userHref,
            className: 'inline-flex max-w-[220px] items-center gap-2.5 rounded-full border border-input py-1 pr-3.5 pl-1 text-sm leading-5 font-medium text-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            ariaLabel: 'Open profile',
            children: (
              <>
                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] leading-none font-bold text-primary-foreground">{userInitial}</span>
                <span className="truncate">{userName}</span>
              </>
            ),
          })}
        </span>
        <Button type="button" variant="destructive" size="icon" aria-label="Log out" title="Log out" onClick={onLogout}>
          <LogOut aria-hidden="true" />
        </Button>
        {actions}
      </div>
    </header>
  );
}
