import type { FormEvent } from 'react';
import { useAuthViewModel } from '../hooks';
import { Logo } from '../../../components/app/Logo';
import {
  UiAlert,
  UiButton,
  UiCard,
  UiCardContent,
  UiCardFooter,
  UiCardHeader,
  UiFlex,
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
      <UiFlex column align="center" gap={3} fullWidth>
        <Logo />
        <UiCard maxWidth={384}>
          <UiCardHeader
            title="Sign In"
            subtitle="Enter your email to sign in to your account."
            centered
          />
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
          </UiCardContent>
          <UiCardFooter centered>
            <UiText variant="body2" tone="muted" as="span">
              Don't have an account?
            </UiText>
            <UiLink to="/register">Sign up</UiLink>
          </UiCardFooter>
        </UiCard>
      </UiFlex>
    </UiPage>
  );
}
