// components/fonts/fonts.ts
import localFont from 'next/font/local';

export const bricolageGrotesque = localFont({
  src: [
    {
      path: './BricolageGrotesque-ExtraLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './BricolageGrotesque-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './BricolageGrotesque-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './BricolageGrotesque-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './BricolageGrotesque-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './BricolageGrotesque-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-bricolage',
  display: 'swap',
  // This family declares six separate files. Preloading the family causes all
  // six to be fetched on every route, even when a weight is not used above the
  // fold. Let the browser request only the faces selected by CSS instead.
  preload: false,
  fallback: ['Inter', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export const worksans = bricolageGrotesque;

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
