import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UiNavButtonProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function UiNavButton({ to, children, onClick }: UiNavButtonProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/dashboard'}
      className={({ isActive }) => cn(
        'inline-flex min-w-0 items-center rounded-full px-3.5 py-2 text-sm font-medium transition-colors outline-none',
        'text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
        isActive && 'bg-accent text-foreground',
      )}
    >
      {children}
    </NavLink>
  );
}
