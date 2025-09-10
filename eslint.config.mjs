import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs,vue}'],
    rules: {
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-unused-vars': ['off'],
      '@typescript-eslint/no-unused-vars': ['off'],
    },
  },
);
