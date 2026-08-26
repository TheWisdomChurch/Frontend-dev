// components/fonts/fonts.ts
import localFont from 'next/font/local';

/**
 * Primary product typeface.
 */
export const dmSans = localFont({
  src: './DMSans-Variable.woff2',
  variable: '--font-product-sans',
  display: 'swap',
  weight: '100 1000',
  fallback: ['Inter', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export const worksans = dmSans;

export const playfair = localFont({
  src: [
    {
      path: './PlayfairDisplay-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './PlayfairDisplay-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './PlayfairDisplay-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});
