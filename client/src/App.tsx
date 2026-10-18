import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './foundation/context';
import { ThemeProvider } from './foundation/theme';
import { AppRouter } from './foundation/router/AppRouter';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
