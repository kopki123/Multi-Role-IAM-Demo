import { promises as fs } from 'fs';
import path from 'path';
import * as z from 'zod';
import { updateUserSchema } from '~/schemas/user';
import type { User } from '~/types/user';
import type { ApiResponse } from '~/types/api';
import { success, error } from '~/utils/apiResponse';

const filePath = path.resolve('server/mock/users.json');

export default defineEventHandler(async (event): Promise<ApiResponse<User>> => {
  try {
    const id = Number(event.context.params?.id);
    const body = await readBody(event);
    const validatedData = updateUserSchema.parse(body);

    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const users = data.users || [];
    const index = users.findIndex((user: User) => user.id === id);

    if (index === -1) {
      setResponseStatus(event, 404, 'User not found');
      throw error('User not found');
    }

    users[index] = { ...users[index], ...validatedData };

    await fs.writeFile(filePath, JSON.stringify({ users }, null, 2), 'utf-8');

    return success(users, 'Successfully updated user');
  } catch (err) {
    if (err instanceof z.ZodError) {
      setResponseStatus(event, 400, 'Failed to update user');
      throw error('Failed to update user', {
        issues: err.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    setResponseStatus(event, 500, 'Failed to update user');
    throw error('Failed to update user');
  }
});
