import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" /></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};
