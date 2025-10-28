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

export const worksans = localFont({
  src: [
    {
      path: './WorkSans-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './WorkSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './WorkSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    // {
    //   path: './WorkSans-SemiBold.ttf',
    //   weight: '600',
    //   style: 'normal',
    // },
  ],
  variable: '--font-worksans',
  display: 'swap',
});

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
    {
      path: './PlayfairDisplay-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
});
