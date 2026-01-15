import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useGetCurrentUserQuery } from '../store/api/authApi';
import { setCredentials, clearCredentials } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('employee' | 'manager')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  // Fetch current user if not authenticated
  const { data, isLoading, isError } = useGetCurrentUserQuery(undefined, {
    skip: isAuthenticated, // Skip if already authenticated
  });

  // Update auth state when user data is fetched
  useEffect(() => {
    if (data?.user && !isAuthenticated) {
      dispatch(setCredentials(data.user));
    }
    if (isError) {
      dispatch(clearCredentials());
    }
  }, [data, isError, isAuthenticated, dispatch]);

  // Show loading state while checking authentication
  if (isLoading || (!isAuthenticated && !isError)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || isError) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

