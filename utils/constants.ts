// 分頁相關常量
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10 as number,
  DEFAULT_PAGE: 1 as number,
} as const;

export type PaginationConstants = typeof PAGINATION;
