import Container from '@mui/material/Container';

interface UiContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  disableGutters?: boolean;
  children: React.ReactNode;
}

export default function UiContainer({
  maxWidth = 'lg',
  disableGutters = false,
  children,
}: UiContainerProps) {
  return (
    <Container maxWidth={maxWidth} disableGutters={disableGutters}>
      {children}
    </Container>
  );
}
