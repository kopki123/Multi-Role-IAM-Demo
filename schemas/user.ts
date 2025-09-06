import * as z from 'zod';
import type { Role } from '~/types/user';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  role: z.enum(['Admin', 'Editor', 'Viewer'] as [...Role[]]),
});

export const updateUserSchema = createUserSchema;

// Infer TypeScript types
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>