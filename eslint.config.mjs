// eslint.config.mjs
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
        process: 'readonly',
        module: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'no-undef': 'off', // TypeScript handles this
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'out/**',
      '*.js',
      '*.mjs',
      '*.cjs',
      '*.config.js',
      '*.config.mjs',
      'scripts/**',
      'commitlint.config.js',
      'postcss.config.mjs',
      'tailwind.config.js',
      'eslint.config.mjs'
    ],
  },
];