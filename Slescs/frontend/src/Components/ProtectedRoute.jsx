import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/slices/auth-slice';
import { useEffect } from "react"

const ProtectedRoute = () => {
  const { isAuthenticated, refreshAccessToken } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated && localStorage.getItem('refreshToken')) {
      refreshAccessToken();
    }
  }, [isAuthenticated, refreshAccessToken]);
  if (!isAuthenticated && !localStorage.getItem('refreshToken')) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;