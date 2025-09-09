import type { ApiResponse } from '~/types/api';
import type { NitroFetchRequest, $Fetch } from 'nitropack';

export async function apiHandler<T>(
  url: string,
  options?: Parameters<typeof $fetch>[1]
): Promise<ApiResponse<T>> {
  const { $api } = useNuxtApp() as { $api: $Fetch<NitroFetchRequest> };

  try {
    return await $api<ApiResponse<T>>(url, options);
  } catch (err) {
    return {
      status: 'error',
      message: (err as string) || 'Unknown error',
    };
  }
}
