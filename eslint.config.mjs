// eslint.config.mjs
import js from '@eslint/js';
import next from 'eslint-config-next';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...next({
    files: ['**/*.ts', '**/*.tsx'],
  }),
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
    },
  },
  {
    ignores: ['node_modules/', '.next/', 'dist/', 'out/'],
  },
];