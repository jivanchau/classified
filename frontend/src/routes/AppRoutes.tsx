import { Route, Routes, Navigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import AppLayout from '../components/AppLayout';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../features/admin/DashboardPage';
import UsersPage from '../modules/users/UsersPage';
import RolesPage from '../modules/roles/RolesPage';
import AddRolePage from '../modules/roles/AddRolePage';
import PermissionsPage from '../modules/permissions/PermissionsPage';
import CategoriesPage from '../modules/categories/CategoriesPage';
import MediaPage from '../modules/media/MediaPage';
import UnauthorizedPage from '../features/auth/UnauthorizedPage';
import HomePage from '../features/home/HomePage';
import { RoleGuard } from '../components/RoleGuard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/admin/master/users"
            element={
              <RoleGuard roles={["admin"]}>
                <UsersPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/master/categories"
            element={
              <RoleGuard roles={["admin"]}>
                <CategoriesPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/master/media"
            element={
              <RoleGuard roles={["admin"]}>
                <MediaPage />
              </RoleGuard>
            }
          />
          <Route path="/users" element={<Navigate to="/admin/master/users" replace />} />
          <Route path="/categories" element={<Navigate to="/admin/master/categories" replace />} />
          <Route path="/media" element={<Navigate to="/admin/master/media" replace />} />
          <Route
            path="/admin/settings/roles"
            element={
              <RoleGuard roles={["admin"]}>
                <RolesPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/settings/permissions"
            element={
              <RoleGuard roles={["admin"]}>
                <PermissionsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/settings/roles/new"
            element={
              <RoleGuard roles={["admin"]}>
                <AddRolePage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/settings/roles/:id/edit"
            element={
              <RoleGuard roles={["admin"]}>
                <AddRolePage />
              </RoleGuard>
            }
          />
          <Route path="/roles" element={<Navigate to="/admin/settings/roles" replace />} />
          <Route path="/roles/new" element={<Navigate to="/admin/settings/roles/new" replace />} />
          <Route path="/permissions" element={<Navigate to="/admin/settings/permissions" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
