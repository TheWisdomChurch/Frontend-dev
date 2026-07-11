import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextConfig from 'eslint-config-next';
import { fileURLToPath } from 'url';

const tsRoot = fileURLToPath(new URL('.', import.meta.url));

const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.next-prepush/**',
      'dist/**',
      'src/archive/**',
      'next-env.d.ts',
      '*.config.js',
      '*.config.ts',
      '**/*.css',
      '**/*.scss',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}', '*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: tsRoot,
      },
    },
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@next/next/no-img-element': 'off',
      'prefer-const': 'warn',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            'JSXAttribute[name.name="style"] > JSXExpressionContainer > ObjectExpression',
          message:
            'Avoid inline style objects. Use Tailwind classes or CSS variables instead. Only use style={{}} for truly dynamic runtime values.',
        },
      ],
    },
  },
  {
    files: ['**/*.scss'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
];

export default config;
