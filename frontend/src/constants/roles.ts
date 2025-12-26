export const ROLES = {
  ADMIN: 'admin',
  SUPPORT: 'support',
  CLIENT_ADMIN: 'client_admin',
  CLIENT: 'client',
  USERT: 'usert'
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
export const ROLE_LIST: RoleName[] = Object.values(ROLES);
