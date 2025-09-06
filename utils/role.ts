import type { Role } from '~/types/user';

export type ColorVariant = 'primary' | 'secondary' | 'neutral'

export const ROLE_OPTIONS: Role[] = ['Admin', 'Editor', 'Viewer'];

const roleToColorMap: Record<Role, ColorVariant> = {
  Admin: 'primary',
  Editor: 'secondary',
  Viewer: 'neutral',
};

export function getRoleColor(role: Role): ColorVariant {
  return roleToColorMap[role];
}


