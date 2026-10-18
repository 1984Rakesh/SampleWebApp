import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import type { CardProps } from '@mui/material/Card';
import type { CardHeaderProps } from '@mui/material/CardHeader';
import type { CardContentProps } from '@mui/material/CardContent';

export function UiCard(props: CardProps) {
  return <Card {...props} />;
}

export function UiCardHeader(props: CardHeaderProps) {
  return <CardHeader {...props} />;
}

export function UiCardContent(props: CardContentProps) {
  return <CardContent {...props} />;
}
