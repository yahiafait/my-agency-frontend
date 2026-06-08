import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

/** Accès staff : admin ou manager. */
export default function ProtectedAdminRoute({ children }) {
  const { isStaff } = useAdminAuth();
  const location = useLocation();

  if (!isStaff) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
