import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequireAuth({ children, minRole }) {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (minRole && !hasRole(minRole)) return <Navigate to="/" replace />;

  return children;
}
