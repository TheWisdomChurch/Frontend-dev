// eslint.config.mjs
import js from '@eslint/js';
import next from 'eslint-config-next';

export default [
  js.configs.recommended,
  ...next({
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  }),
  {
    rules: {
      'prefer-const': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    ignores: ['node_modules/', '.next/', 'dist/', 'out/'],
  },
];