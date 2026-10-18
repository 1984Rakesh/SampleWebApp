import { useState } from 'react';
import { useAuth } from '../../foundation/context';
import { useAuthRepository } from '../../data/repositories';
import { loginUseCase, registerUserUseCase } from '../../domain/useCases';
import { useNavigate } from 'react-router-dom';

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useAuthViewModel() {
  const { user, isLoading, isAuthenticated, setSession, signOut } = useAuth();
  const { repository, isLoggingIn, isRegistering } = useAuthRepository();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setErrorMessage(undefined);
    try {
      const session = await loginUseCase(repository, { email, password });
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
      const session = await registerUserUseCase(repository, { name, email, password });
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
    isSubmitting: isLoggingIn || isRegistering,
    isAuthenticated,
    errorMessage,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
