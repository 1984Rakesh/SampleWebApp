import React from 'react';
import { BrowserRouter, Outlet, useRoutes } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './routeGuards';
import { LoadingSpinner } from '../../components/feedback';
import { AppNavbar, comparison, dashboard, profile, security, tasks } from '../composition';

// App only mounts feature route entries inside the shell; each feature owns its own routes (shared §9).
function PublicLayout() {
  return <PublicRoute><Outlet /></PublicRoute>;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppNavbar />
      <Outlet />
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return useRoutes([
    { element: <PublicLayout />, children: security.routes },
    {
      element: <ProtectedLayout />,
      children: [...dashboard.routes, ...profile.routes, ...tasks.routes, ...comparison.routes],
    },
  ]);
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <React.Suspense
        fallback={
          <main className="flex min-h-screen items-center justify-center bg-background p-4">
            <LoadingSpinner text="Loading..." />
          </main>
        }
      >
        <AppRoutes />
      </React.Suspense>
    </BrowserRouter>
  );
}
