import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '../../components/feedback';
import { DashboardRoute } from '../../dashboard';
import { SecurityRoute } from '../../security';
import { security } from '../composition';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = security.useSession();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoadingSpinner text="Loading..." />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={SecurityRoute.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = security.useSession();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoadingSpinner text="Loading..." />
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={DashboardRoute.home} replace />;
  }

  return <>{children}</>;
}
