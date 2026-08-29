import localFont from 'next/font/local';

/**
 * The one app typeface. Exposed as `--font-sans` (via `--font-product-sans`,
 * kept as the injected variable name for compatibility).
 */
export const dmSans = localFont({
  src: './DMSans-Variable.woff2',
  variable: '--font-product-sans',
  display: 'swap',
  weight: '100 1000',
  fallback: ['Inter', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
});
