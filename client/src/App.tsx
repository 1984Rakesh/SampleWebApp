import { AuthProvider, ThemeProvider } from './foundation/context';
import { AppRouter } from './foundation/router/AppRouter';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
