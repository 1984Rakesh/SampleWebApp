import type { FormEvent } from 'react';
import { useAuthViewModel } from '../hooks';
import {
  UiAlert,
  UiButton,
  UiCard,
  UiCardContent,
  UiCardHeader,
  UiLink,
  UiPage,
  UiStack,
  UiText,
  UiTextField,
} from '../../../components/ui';

export default function LoginScreen() {
  const { email, password, setEmail, setPassword, login, isSubmitting, errorMessage } =
    useAuthViewModel();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await login();
  };

  return (
    <UiPage>
      <UiCard maxWidth={448}>
        <UiCardHeader title="Sign In" centered />
        <UiCardContent>
          {errorMessage && (
            <UiAlert type="error" gutterBottom>
              {errorMessage}
            </UiAlert>
          )}

          <form onSubmit={handleSubmit} aria-label="Login form">
            <UiStack spacing={2}>
              <UiTextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
              <UiTextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                required
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <UiButton
                type="submit"
                variant="solid"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Sign In
              </UiButton>
            </UiStack>
          </form>

          <UiText variant="body2" tone="muted" align="center" mt={2}>
            Don't have an account? <UiLink to="/register">Sign up</UiLink>
          </UiText>
        </UiCardContent>
      </UiCard>
    </UiPage>
  );
}
