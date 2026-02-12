/* global URL */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import { fileURLToPath } from 'url';

const tsRoot = fileURLToPath(new URL('.', import.meta.url));

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', '*.config.js', '*.config.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: tsRoot,
      },
      globals: {
        URL: 'readonly',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@next/next/no-img-element': 'off',
      'prefer-const': 'off',
      'no-console': 'off',
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
];
