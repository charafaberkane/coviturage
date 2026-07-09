import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center flex flex-col gap-3">
          <Spinner size="lg" />
          <p className="text-sm font-semibold text-slate-500">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they don't have the right role, redirect to Forbidden page
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export const PublicRoute: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect already logged-in users to their correct home page
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'CONDUCTEUR') {
      return <Navigate to="/driver" replace />;
    } else {
      return <Navigate to="/passenger" replace />;
    }
  }

  return <Outlet />;
};
