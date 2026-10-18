import { useState } from 'react';
import { useAuth } from '../../foundation/context';
import { useAuthUseCases } from '../../foundation/composition';
import { useNavigate } from 'react-router-dom';

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useAuthViewModel() {
  const { user, isLoading, isAuthenticated, setSession, signOut } = useAuth();
  const authUseCases = useAuthUseCases();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setErrorMessage(undefined);
    try {
      const session = await authUseCases.login({ email, password });
      setSession(session);
      navigate('/dashboard');
      return true;
    } catch (error) {
      setErrorMessage(toErrorMessage(error, 'Login failed'));
      return false;
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setErrorMessage(undefined);
    try {
      const session = await authUseCases.register({ name, email, password });
      setSession(session);
      navigate('/dashboard');
      return true;
    } catch (error) {
      setErrorMessage(toErrorMessage(error, 'Registration failed'));
      return false;
    }
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return {
    user,
    isLoading,
    isSubmitting: authUseCases.isLoggingIn || authUseCases.isRegistering,
    isAuthenticated,
    errorMessage,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
