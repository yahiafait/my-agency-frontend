import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

/** Routes réservées à l’administrateur (managers, destinations). */
export default function ProtectedAdminOnlyRoute({ children }) {
  const { isStaff, isAdmin } = useAdminAuth();
  const location = useLocation();

  if (!isStaff) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/messages" replace />;
  }

  return children;
}
