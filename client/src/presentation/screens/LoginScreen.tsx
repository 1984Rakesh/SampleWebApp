import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuthViewModel } from '../hooks';
import { UiPage, UiCard, UiCardContent, UiCardHeader, UiTextField, UiButton, UiAlert } from '../components/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isSubmitting, errorMessage } = useAuthViewModel();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await login(email, password);
  };

  return (
    <UiPage>
      <UiCard sx={{ maxWidth: 448, width: '100%' }}>
        <UiCardHeader title="Sign In" titleTypographyProps={{ textAlign: 'center', variant: 'h5' }} />
        <UiCardContent>
          {errorMessage && (
            <UiAlert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </UiAlert>
          )}

          <form onSubmit={handleSubmit} aria-label="Login form">
            <Stack spacing={2}>
              <UiTextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
              <UiTextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <UiButton
                type="submit"
                variant="contained"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Sign In
              </UiButton>
            </Stack>
          </form>

          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Sign up
            </Link>
          </Typography>
        </UiCardContent>
      </UiCard>
    </UiPage>
  );
}
