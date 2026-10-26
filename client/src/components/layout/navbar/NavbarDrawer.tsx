import { NavLink } from 'react-router-dom';
import { Separator, Sheet, SheetContent, SheetTitle, cn } from '../../ui';
import type { NavbarViewState } from './NavbarViewState';

interface Props {
  view: NavbarViewState;
  open: boolean;
  onClose: () => void;
}

export default function NavbarDrawer({ view, open, onClose }: Props) {
  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent side="left" showCloseButton={false} className="w-70 max-w-[85vw] gap-0 p-0">
        <div className="flex flex-col gap-1 p-5">
          <SheetTitle className="font-display text-base font-semibold">Navigation</SheetTitle>
          <p className="truncate text-sm text-muted-foreground">{view.userName}</p>
        </div>
        <Separator />
        <ul className="flex flex-col gap-1 p-3">
          {view.links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) => cn(
                  'flex w-full items-center rounded-full px-3.5 py-2 text-sm font-medium no-underline outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                )}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
