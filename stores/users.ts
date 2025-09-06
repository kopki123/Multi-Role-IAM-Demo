
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
      total: 0,
    },
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
      this.pagination = {
        pageIndex,
        pageSize,
        total,
      };

      return response;
    },
    async createUser(userData: Omit<User, 'id'>) {
      const response = await apiHandler<User>('/users', {
        method: 'POST',
        body: userData
      });

      return response;
    },
    async updateUser(id: number, userData: Partial<Omit<User, 'id'>>) {
      const response = await apiHandler<User>(`/users/${id}`, {
        method: 'PUT',
        body: userData
      });

      return response;
    },
    async deleteUser(id: number) {
      const response = await apiHandler(`/users/${id}`, { method: 'DELETE' });

      return response;
    },
  }
});
