import { promises as fs } from 'fs';
import path from 'path';
import type { User } from '~/types/user';
import type { ApiResponse } from '~/types/api';
import { success, error } from '~/utils/apiResponse';

const filePath = path.resolve('server/mock/users.json');

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const id = Number(event.context.params?.id);
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    let users = data.users || [];

    users = users.filter((user: User) => user.id !== id);

    await fs.writeFile(filePath, JSON.stringify({ users }, null, 2), 'utf-8');

    return success(undefined, 'Successfully deleted user');
  } catch (err) {
    setResponseStatus(event, 500, 'Failed to delete user');
    return error('Failed to delete user');
  }
});