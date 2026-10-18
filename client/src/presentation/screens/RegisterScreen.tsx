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
} from '../components/ui';

export default function RegisterScreen() {
  const {
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    register,
    isSubmitting,
    errorMessage,
  } = useAuthViewModel();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await register();
  };

  return (
    <UiPage>
      <UiCard maxWidth={448}>
        <UiCardHeader title="Create Account" centered />
        <UiCardContent>
          {errorMessage && (
            <UiAlert type="error" gutterBottom>
              {errorMessage}
            </UiAlert>
          )}

          <form onSubmit={handleSubmit}>
            <UiStack spacing={2}>
              <UiTextField
                id="name"
                label="Name"
                value={name}
                onChange={setName}
                required
                disabled={isSubmitting}
                autoComplete="name"
              />
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
                autoComplete="new-password"
              />
              <UiButton
                type="submit"
                variant="solid"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Sign Up
              </UiButton>
            </UiStack>
          </form>

          <UiText variant="body2" tone="muted" align="center" mt={2}>
            Already have an account? <UiLink to="/login">Sign in</UiLink>
          </UiText>
        </UiCardContent>
      </UiCard>
    </UiPage>
  );
}
