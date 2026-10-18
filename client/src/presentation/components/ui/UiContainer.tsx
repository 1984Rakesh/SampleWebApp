import Container from '@mui/material/Container';
import type { ContainerProps } from '@mui/material/Container';

export default function UiContainer(props: ContainerProps) {
  return <Container maxWidth="lg" {...props} />;
}
