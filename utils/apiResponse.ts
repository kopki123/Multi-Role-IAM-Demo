import type { ApiResponse } from '~/types/api';

// 成功回覆
export function success<T>(data?: T, message = 'success'): ApiResponse<T> {
  return { status: 'success', message, data };
}

// 錯誤回覆
export function error(message: string, data?: unknown): ApiResponse {
  return { status: 'error', message, data };
}
