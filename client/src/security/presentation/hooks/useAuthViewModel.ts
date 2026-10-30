import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useAuthUseCases, useSecurityRouting } from '../context';
import { SecurityRoute } from '../contracts';

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useAuthViewModel() {
  const { user, isLoading, isAuthenticated, setSession, signOut } = useAuth();
  const authUseCases = useAuthUseCases();
  const { homePath } = useSecurityRouting();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleLogin = async (loginEmail = email, loginPassword = password): Promise<boolean> => {
    setErrorMessage(undefined);
    try {
      const session = await authUseCases.login({ email: loginEmail, password: loginPassword });
      setSession(session);
      navigate(homePath);
      return true;
    } catch (error) {
      setErrorMessage(toErrorMessage(error, 'Login failed'));
      return false;
    }
  };

  const handleRegister = async (
    registerName = name,
    registerEmail = email,
    registerPassword = password
  ): Promise<boolean> => {
    setErrorMessage(undefined);
    try {
      const session = await authUseCases.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      setSession(session);
      navigate(homePath);
      return true;
    } catch (error) {
      setErrorMessage(toErrorMessage(error, 'Registration failed'));
      return false;
    }
  };

  const handleLogout = () => {
    signOut();
    navigate(SecurityRoute.login);
  };

  return {
    userName: user?.name,
    isLoading,
    isSubmitting: authUseCases.isLoggingIn || authUseCases.isRegistering,
    isAuthenticated,
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    errorMessage,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
