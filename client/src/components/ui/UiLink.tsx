import { Link as RouterLink } from 'react-router-dom';

interface UiLinkProps {
  to: string;
  children: React.ReactNode;
}

export default function UiLink({ to, children }: UiLinkProps) {
  return (
    <RouterLink to={to} className="text-primary underline-offset-4 hover:underline">
      {children}
    </RouterLink>
  );
}
