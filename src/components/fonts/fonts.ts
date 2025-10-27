import localFont from 'next/font/local';

export const bricolageGrotesque = localFont({
  src: [
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
  ],
  variable: '--font-bricolage',
  display: 'swap',
});
