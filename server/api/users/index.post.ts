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

    return success('Successfully added user', newUser);
  } catch (err) {
    setResponseStatus(event, 500, 'Failed to add user');
    throw error('Failed to add user');
  }
});
