import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/store';

interface Props {
  roles?: string[];
  permissions?: string[];
  children: ReactNode;
}

export function RoleGuard({ roles = [], permissions = [], children }: Props) {
  const user = useAppSelector(state => state.auth.user);

  const hasRole = roles.length === 0 || roles.some(r => user?.roles.includes(r));
  const hasPermission = permissions.length === 0 || permissions.some(p => user?.permissions.includes(p));

  if (!user || !hasRole || !hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
