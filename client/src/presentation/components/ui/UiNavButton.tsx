import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';

interface UiNavButtonProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function UiNavButton({ to, children, onClick }: UiNavButtonProps) {
  return (
    <Button
      component={NavLink}
      to={to}
      onClick={onClick}
      end={to === '/dashboard'}
      sx={{
        minWidth: 0,
        px: 1.75,
        py: 1,
        borderRadius: 999,
        color: 'text.secondary',
        fontSize: 14,
        fontWeight: 500,
        '&.active': { bgcolor: 'action.selected', color: 'text.primary' },
      }}
    >
      {children}
    </Button>
  );
}
