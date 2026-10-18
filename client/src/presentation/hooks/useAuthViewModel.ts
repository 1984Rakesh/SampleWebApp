import { useAuth } from '../../foundation/context';
import { useAuthRepository } from '../../data/repositories';
import { useNavigate } from 'react-router-dom';

export function useAuthViewModel() {
  const { user, isLoading, isAuthenticated, login, register, logout } = useAuth();
  const { useLoginMutation, useRegisterMutation, useLogoutMutation } = useAuthRepository();
  const navigate = useNavigate();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      login(email, password); // Also update AuthContext
      navigate('/dashboard');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const result = await registerMutation.mutateAsync({ name, email, password });
      register(name, email, password); // Also update AuthContext
      navigate('/dashboard');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    logout(); // Also update AuthContext
    navigate('/login');
  };

  return {
    user,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    error: loginMutation.error || registerMutation.error,
  };
}
