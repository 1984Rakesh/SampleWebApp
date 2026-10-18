import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './foundation/context';
import { ThemeProvider } from './foundation/theme';
import { AppRouter } from './foundation/router/AppRouter';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';
import { UiSnackbar } from './presentation/components/ui';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <AppRouter />
            {toast && (
              <UiSnackbar
                open={!!toast}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
