// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  app: {
    head: {
      title: 'Multi-Role IAM Demo',
    },
  },

  css: [
    '~/assets/css/main.css',
  ],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/fonts',
  ],

  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Noto Sans TC', provider: 'google' },
    ],
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      apiTimeout: Number(process.env.API_TIMEOUT) || 10000,
    },
  },
});