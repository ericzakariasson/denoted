module.exports = {
  extends: [
    'next',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['simple-import-sort', '@typescript-eslint', 'unused-imports'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-var-requires': 'warn',
    'unused-imports/no-unused-imports': 'warn',
  },
};
