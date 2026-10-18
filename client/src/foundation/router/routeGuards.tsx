import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UiPage, UiText } from '../../presentation/components/ui';
import { useAuth } from '../context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <UiPage>
        <UiText tone="muted">Loading...</UiText>
      </UiPage>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <UiPage>
        <UiText tone="muted">Loading...</UiText>
      </UiPage>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
