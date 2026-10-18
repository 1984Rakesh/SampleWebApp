import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './routeGuards';
import { UiPage, UiText } from '../../presentation/components/ui';
import Navbar from '../../presentation/components/Navbar';

// Placeholder screens - will be implemented in Phase 9
const LoginScreen = React.lazy(() => import('../../presentation/screens/LoginScreen'));
const RegisterScreen = React.lazy(() => import('../../presentation/screens/RegisterScreen'));
const DashboardScreen = React.lazy(() => import('../../presentation/screens/DashboardScreen'));
const ProfileScreen = React.lazy(() => import('../../presentation/screens/ProfileScreen'));
const TaskListScreen = React.lazy(() => import('../../presentation/screens/TaskListScreen'));
const ComparisonScreen = React.lazy(() => import('../../presentation/screens/ComparisonScreen'));

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <React.Suspense
        fallback={
          <UiPage>
            <UiText tone="muted">Loading...</UiText>
          </UiPage>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterScreen />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <DashboardScreen />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <DashboardScreen />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <ProfileScreen />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <TaskListScreen />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/comparison"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <ComparisonScreen />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
