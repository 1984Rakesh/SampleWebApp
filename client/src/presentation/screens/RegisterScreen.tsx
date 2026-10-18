import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuthViewModel } from '../hooks';
import { UiPage, UiCard, UiCardContent, UiCardHeader, UiTextField, UiButton, UiAlert } from '../components/ui';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isSubmitting, errorMessage } = useAuthViewModel();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await register(name, email, password);
  };

  return (
    <UiPage>
      <UiCard sx={{ maxWidth: 448, width: '100%' }}>
        <UiCardHeader title="Create Account" titleTypographyProps={{ textAlign: 'center', variant: 'h5' }} />
        <UiCardContent>
          {errorMessage && (
            <UiAlert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </UiAlert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <UiTextField
                id="name"
                label="Name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="name"
              />
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
                autoComplete="new-password"
              />
              <UiButton
                type="submit"
                variant="contained"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Sign Up
              </UiButton>
            </Stack>
          </form>

          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </UiCardContent>
      </UiCard>
    </UiPage>
  );
}
