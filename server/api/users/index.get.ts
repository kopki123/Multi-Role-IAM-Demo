import type { ApiResponse } from '~/types/api';
import type { User, PaginatedResponse } from '~/types/user';
import { success, error } from '~/utils/apiResponse';
import { PAGINATION } from '~/utils/constants';
import { readUsersFile } from '../../utils/userFile';

export default defineEventHandler(async (event): Promise<ApiResponse<PaginatedResponse<User>>> => {
  try {
    const query = getQuery(event);
    const pageIndex = Number(query?.pageIndex) || PAGINATION.DEFAULT_PAGE;
    const pageSize = Number(query?.pageSize) || PAGINATION.DEFAULT_PAGE_SIZE;

    const data = await readUsersFile();

    let users = data.users || [];

    if (query?.name) {
      users = users.filter((user: User) => user.name === query.name);
    }

    if (query?.email) {
      users = users.filter((user: User) => user.email === query.email);
    }

    const start = (pageIndex - 1) * pageSize;
    const end = start + pageSize;

    const response = {
      items: users.slice(start, end),
      total: users.length,
      pageIndex,
      pageSize,
    };

    return success('Successfully retrieved user list', response);
  } catch {
    setResponseStatus(event, 500, 'Failed to retrieved user list');
    throw error('Failed to retrieved user list');
  }
});
