import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import type { SxProps, Theme } from '@mui/material/styles';

const cardSx: SxProps<Theme> = {
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#161F30' : 'background.paper'),
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
};

interface UiCardProps {
  children: React.ReactNode;
  maxWidth?: number;
  spaced?: boolean;
  to?: string;
}

export function UiCard({ children, maxWidth, spaced = false, to }: UiCardProps) {
  const content = to ? (
    <CardActionArea component={RouterLink} to={to} sx={{ height: '100%' }}>
      {children}
    </CardActionArea>
  ) : (
    children
  );

  return (
    <Card
      elevation={0}
      sx={{
        ...cardSx,
        ...(spaced && { mb: 3 }),
        ...(maxWidth !== undefined && { maxWidth, width: '100%' }),
      }}
    >
      {content}
    </Card>
  );
}

interface UiCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  centered?: boolean;
}

export function UiCardHeader({ title, subtitle, action, centered = false }: UiCardHeaderProps) {
  return (
    <CardHeader
      title={title}
      subheader={subtitle}
      action={action}
      titleTypographyProps={centered ? { textAlign: 'center', variant: 'h5' } : undefined}
    />
  );
}

interface UiCardContentProps {
  children: React.ReactNode;
  compact?: boolean;
}

export function UiCardContent({ children, compact = false }: UiCardContentProps) {
  return (
    <CardContent
      sx={
        compact
          ? { p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }
          : undefined
      }
    >
      {children}
    </CardContent>
  );
}
