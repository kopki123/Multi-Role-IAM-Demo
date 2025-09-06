export type Role = 'Admin' | 'Editor' | 'Viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface PaginationQuery {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  email?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}
