import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth';
import { isAccessTokenValid } from '../../services/auth/token';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = null
}) => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  // If auth is still loading, show nothing (or a loading spinner)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if access token is valid
  const tokenValid = isAccessTokenValid();

  // If user is not authenticated or token is invalid, redirect to login
  if (!isAuthenticated || !tokenValid) {
    // Redirect to login page
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return fallback;
  }

  // If user is authenticated and token is valid, render children
  return <>{children}</>;
};

export default ProtectedRoute;