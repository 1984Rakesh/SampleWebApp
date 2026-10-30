import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { FeatureProviders } from './FeatureProviders';
import { ThemeProvider } from '../../foundation/theme';
import { ErrorBoundary } from '../../components/feedback';
import { Toaster } from '../../components/ui';

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
          <FeatureProviders>
            {children}
            <Toaster position="top-right" />
          </FeatureProviders>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
