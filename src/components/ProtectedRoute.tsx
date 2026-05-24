import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from './ui/Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'nvo' | 'youth' | 'admin';
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <PageSpinner />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}
