import type { ApiResponse } from '~/types/api';

export async function apiHandler<T>(
  url: string,
  options?: Parameters<typeof $fetch>[1]
): Promise<ApiResponse<T>> {
  const { $api } = useNuxtApp();

  try {
    const response = await $api<ApiResponse<T>>(url, options);

    return response;
  } catch (err) {
    return {
      status: 'error',
      message: err as string || 'Unknown error',
    };
  }
}
