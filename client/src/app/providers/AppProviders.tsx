import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { FeatureUseCasesProvider } from './FeatureUseCasesProvider';
import { ThemeProvider } from '../../foundation/theme';
import { ErrorBoundary } from '../../components/feedback/ErrorBoundary';
import { UiToastHost } from '../../components/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <FeatureUseCasesProvider>{children}</FeatureUseCasesProvider>
            <UiToastHost />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
