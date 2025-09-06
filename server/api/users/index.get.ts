import { promises as fs } from 'fs';
import path from 'path';
import type { User, PaginatedResponse } from '~/types/user';
import { success, error } from '~/utils/apiResponse';
import type { ApiResponse } from '~/types/api';
import { PAGINATION } from '~/utils/constants';

const filePath = path.resolve('server/mock/users.json');

export default defineEventHandler(async (event): Promise<ApiResponse<PaginatedResponse<User>>> => {
  try {
    const query = getQuery(event);
    const pageIndex = Number(query?.pageIndex) || PAGINATION.DEFAULT_PAGE;
    const pageSize = Number(query?.pageSize) || PAGINATION.DEFAULT_PAGE_SIZE;
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

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

    return success(response, 'Successfully retrieved user list');
  } catch (err) {
    setResponseStatus(event, 500, 'Failed to retrieve user list');
    throw error('Failed to retrieve user list');
  }
});
