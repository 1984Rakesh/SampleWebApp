import { Component, type ReactNode, type ErrorInfo } from 'react';
import { UiPage } from './ui';
import { UiCard, UiCardContent, UiCardHeader } from './ui';
import { UiButton } from './ui';
import Typography from '@mui/material/Typography';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <UiPage>
          <UiCard sx={{ maxWidth: 448, width: '100%' }}>
            <UiCardHeader title="Something went wrong" />
            <UiCardContent>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {this.state.error?.message || 'An unexpected error occurred'}
              </Typography>
              <UiButton variant="contained" fullWidth onClick={() => window.location.reload()}>
                Reload Page
              </UiButton>
            </UiCardContent>
          </UiCard>
        </UiPage>
      );
    }

    return this.props.children;
  }
}
