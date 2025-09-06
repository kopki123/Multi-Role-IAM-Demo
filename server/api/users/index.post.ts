import * as z from 'zod';
import { createUserSchema } from '~/schemas/user';
import type { User } from '~/types/user';
import type { ApiResponse } from '~/types/api';
import { success, error } from '~/utils/apiResponse';
import { readUsersFile, writeUsersFile } from '../../utils/userFile';

export default defineEventHandler(async (event): Promise<ApiResponse<User>> => {
  try {
    const body = await readBody(event);
    const validatedData = createUserSchema.parse(body);

    const data = await readUsersFile();
    const users = data.users || [];
    const newUser = { id: Date.now(), ...validatedData };

    users.unshift(newUser);

    await writeUsersFile(users);

    return success(newUser, 'Successfully added user');
  } catch (err) {
    if (err instanceof z.ZodError) {
      setResponseStatus(event, 400, 'Failed to add user');
      throw error('Failed to add user', {
        issues: err.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    setResponseStatus(event, 500, 'Failed to add user');
    throw error('Failed to add user');
  }
});
