export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    timeout: config.public.apiTimeout,
    onRequestError({ error }) {
      return Promise.reject(`[Network Error] ${error.message}`);
    },
    onResponseError({ response }) {
      if (response._data) {
        return Promise.reject(`[API Error] ${response._data.message}`);
      }

      return Promise.reject(`[API Error] ${response.statusText}`);
    },
  });

  return {
    provide: { api },
  };
});
