import { promises as fs } from 'fs';
import path from 'path';
import * as z from 'zod';
import { createUserSchema } from '~/schemas/user';
import type { User } from '~/types/user';
import type { ApiResponse } from '~/types/api';
import { success, error } from '~/utils/apiResponse';

const filePath = path.resolve('server/mock/users.json');

export default defineEventHandler(async (event): Promise<ApiResponse<User>> => {
  try {
    const body = await readBody(event);
    const validatedData = createUserSchema.parse(body);

    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const users = data.users || [];
    const newUser = { id: Date.now(), ...validatedData };

    users.unshift(newUser);

    await fs.writeFile(filePath, JSON.stringify({ users }, null, 2), 'utf-8');

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
