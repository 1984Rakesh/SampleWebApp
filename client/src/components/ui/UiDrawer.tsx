import { Link as RouterLink } from 'react-router-dom';
import { Sheet, SheetContent, SheetTitle } from './sheet';
import UiIcon from './UiIcon';
import type { UiIconName } from './UiIcon';
import { cn } from './utils';

interface UiDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function UiDrawer({ open, onClose, children }: UiDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent side="left" showCloseButton={false} className="w-70 max-w-[85vw] gap-0 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export interface UiNavItem {
  label: string;
  to?: string;
  onClick?: () => void;
  icon?: UiIconName;
  tone?: 'danger';
}

interface UiNavListProps {
  items: UiNavItem[];
}

const navItemClass = (tone?: 'danger') => cn(
  'flex w-full items-center gap-4 px-4 py-2 text-left text-sm transition-colors hover:bg-accent',
  tone === 'danger' ? 'text-destructive' : 'text-foreground',
);

export function UiNavList({ items }: UiNavListProps) {
  return (
    <ul className="py-2">
      {items.map((item) => (
        <li key={item.label}>
          {item.to ? (
            <RouterLink to={item.to} onClick={item.onClick} className={navItemClass(item.tone)}>
              {item.icon && <UiIcon name={item.icon} />}
              <span>{item.label}</span>
            </RouterLink>
          ) : (
            <button type="button" onClick={item.onClick} className={navItemClass(item.tone)}>
              {item.icon && <UiIcon name={item.icon} />}
              <span>{item.label}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
