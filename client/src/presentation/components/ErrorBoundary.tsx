import { Component, type ReactNode, type ErrorInfo } from 'react';
import { UiPage, UiCard, UiCardContent, UiCardHeader, UiButton, UiText } from './ui';

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
          <UiCard maxWidth={448}>
            <UiCardHeader title="Something went wrong" />
            <UiCardContent>
              <UiText tone="muted" mb={3}>
                {this.state.error?.message || 'An unexpected error occurred'}
              </UiText>
              <UiButton variant="solid" fullWidth onClick={() => window.location.reload()}>
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
