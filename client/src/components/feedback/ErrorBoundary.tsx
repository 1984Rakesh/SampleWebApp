import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui';

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
        <main className="mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center px-4 sm:px-8">
          <Card className="w-full max-w-md rounded-xl">
            <CardHeader>
              <CardTitle className="font-display text-xl font-semibold">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button className="w-full" onClick={() => window.location.reload()}>
                Reload page
              </Button>
            </CardContent>
          </Card>
        </main>
      );
    }

    return this.props.children;
  }
}
