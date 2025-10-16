import localFont from 'next/font/local';

// 🩶 Bricolage Grotesque
export const bricolageGrotesque = localFont({
  src: [
    {
      path: '../../public/fonts/BricolageGrotesque-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/BricolageGrotesque-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/BricolageGrotesque-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/BricolageGrotesque-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/BricolageGrotesque-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/BricolageGrotesque-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/BricolageGrotesque-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-bricolage',
  display: 'swap',
});

// // 🩶 Inter
// export const inter = localFont({
//   src: [
//     {
//       path: '../../public/fonts/Inter-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../../public/fonts/Inter-Bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   variable: '--font-inter',
//   display: 'swap',
// });

// // 🩶 Roboto
// export const roboto = localFont({
//   src: [
//     {
//       path: '../../public/fonts/Roboto-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../../public/fonts/Roboto-Bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   variable: '--font-roboto',
//   display: 'swap',
// });
