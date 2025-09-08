import { defineStore } from 'pinia';
import { PAGINATION } from '~/utils/constants';
import type { User, PaginationQuery, PaginatedResponse } from '~/types/user';
import { apiHandler } from '~/utils/apiHandler';

export const useUsersStore = defineStore('usersStore', {
  state: () => ({
    users: [] as User[],
    pagination: {
      pageIndex: PAGINATION.DEFAULT_PAGE,
      pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    },
    total: 0,
  }),
  actions: {
    setPagination(pageIndex = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE) {
      this.pagination.pageIndex = pageIndex;
      this.pagination.pageSize = pageSize;
    },

    async fetchUsers(query: PaginationQuery = {}) {
      const response = await apiHandler<PaginatedResponse<User>>('/users', {
        method: 'GET',
        params: { ...this.pagination, ...query },
      });

      if (response?.status === 'error') {
        return response;
      }

      const {
        items,
        pageIndex,
        pageSize,
        total,
      } = response!.data!;

      this.users = items;
      this.pagination = { pageIndex, pageSize };
      this.total = total;

      return response;
    },

    async createUser(userData: Omit<User, 'id'>) {
      return await apiHandler<User>('/users', {
        method: 'POST',
        body: userData,
      });
    },

    async updateUser(id: number, userData: Partial<Omit<User, 'id'>>) {
      return await apiHandler<User>(`/users/${id}`, {
        method: 'PUT',
        body: userData,
      });
    },

    async deleteUser(id: number) {
      return await apiHandler(`/users/${id}`, { method: 'DELETE' });
    },
  },
});
