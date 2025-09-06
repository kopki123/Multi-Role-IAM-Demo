import * as z from 'zod';
import type { Role } from '~/types/user';

const roles: Role[] = ['Admin', 'Editor', 'Viewer'];

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  role: z.enum(roles),
});

export const updateUserSchema = createUserSchema;

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;