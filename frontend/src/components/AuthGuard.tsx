import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store';

export default function AuthGuard() {
  const { user, token } = useAppSelector(state => state.auth);
  const location = useLocation();
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
