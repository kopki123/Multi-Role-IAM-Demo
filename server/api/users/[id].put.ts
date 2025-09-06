import * as z from 'zod';
import { updateUserSchema } from '~/schemas/user';
import type { ApiResponse } from '~/types/api';
import type { User } from '~/types/user';
import { success, error } from '~/utils/apiResponse';
import { readUsersFile, writeUsersFile } from '../../utils/userFile';

export default defineEventHandler(async (event): Promise<ApiResponse<User>> => {
  try {
    const id = Number(event.context.params?.id);
    const body = await readBody(event);
    const validatedData = updateUserSchema.parse(body);

    const data = await readUsersFile();
    const users = data.users || [];
    const index = users.findIndex((user: User) => user.id === id);

    if (index === -1) {
      setResponseStatus(event, 404, 'User not found');
      throw error('User not found');
    }

    const newUser = { id, ...validatedData };
    users[index] = newUser;

    await writeUsersFile(users);

    return success(newUser, 'Successfully updated user');
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
