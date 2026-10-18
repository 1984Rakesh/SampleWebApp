import { Link as RouterLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import UiIcon from './UiIcon';
import type { UiIconName } from './UiIcon';

interface UiDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function UiDrawer({ open, onClose, children }: UiDrawerProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: { width: 280, maxWidth: '85vw', bgcolor: 'background.paper' } }}
    >
      {children}
    </Drawer>
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

export function UiNavList({ items }: UiNavListProps) {
  return (
    <List sx={{ py: 1 }}>
      {items.map((item) => (
        <ListItemButton
          key={item.label}
          onClick={item.onClick}
          sx={item.tone === 'danger' ? { color: 'error.main' } : undefined}
          {...(item.to ? { component: RouterLink, to: item.to } : {})}
        >
          {item.icon && <UiIcon name={item.icon} />}
          <ListItemText primary={item.label} sx={item.icon ? { ml: 2 } : undefined} />
        </ListItemButton>
      ))}
    </List>
  );
}
