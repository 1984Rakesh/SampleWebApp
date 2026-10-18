import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

interface UiLinkProps {
  to: string;
  children: React.ReactNode;
}

export default function UiLink({ to, children }: UiLinkProps) {
  return (
    <Link component={RouterLink} to={to} underline="hover">
      {children}
    </Link>
  );
}
