// eslint.config.js - Simple config that works
module.exports = {
  extends: [
    'next/core-web-vitals', // Use Next.js recommended config
  ],
  rules: {
    // Turn off annoying rules
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn', // Warning, not error
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'warn',
    'no-console': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'dist/',
    '*.config.js',
    '*.config.ts',
  ],
};