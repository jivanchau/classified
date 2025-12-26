# Classified App

React 19 + NestJS + Postgres stack with Dockerized frontend/backend. RBAC admin flows for users, roles, and permissions.

## Running locally
1. Copy backend env: `cp backend/.env.example backend/.env` and update secrets.
2. Docker: `docker-compose up --build` (frontend on 3000, backend on 3001, Postgres 5432).
3. Without Docker, run `npm install` in `frontend` and `backend`, start Postgres, then `npm run dev` (frontend) and `npm run start:dev` (backend).

## Frontend
- React Router v7 structure in `frontend/src/routes/AppRoutes.tsx`.
- Redux store in `frontend/src/store`, axios client in `frontend/src/services/api.ts` (points to `/api`).
- Forms via Formik + Yup; DataGrid from MUI for AJAX listings.

## Backend
- NestJS modules for auth, users, roles, permissions under `backend/src`.
- JWT auth with Role guard; TypeORM Postgres setup in `app.module.ts` (synchronize on for starter).
- Admin endpoints for creating users/roles/permissions and assigning roles.
- On startup the backend seeds an admin user/role with full permissions. Configure credentials via `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `backend/.env` (defaults to `admin@classified.local` / `admin123`).
