import type { ApiResponse } from '~/types/api';
import type { User } from '~/types/user';
import { success, error } from '~/utils/apiResponse';
import { readUsersFile, writeUsersFile } from '../../utils/userFile';

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const id = Number(event.context.params?.id);
    const data = await readUsersFile();
    const users = (data.users || []).filter((user: User) => user.id !== id);

    await writeUsersFile(users);

    return success('Successfully deleted user', undefined);
  } catch {
    setResponseStatus(event, 500, 'Failed to delete user');
    throw error('Failed to delete user');
  }
});
