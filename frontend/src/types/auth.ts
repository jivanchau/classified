export type Role = 'admin' | 'user' | string;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  permissions: string[];
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error?: string;
}
