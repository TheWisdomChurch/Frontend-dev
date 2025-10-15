import { Bricolage_Grotesque as FontBricolage } from 'next/font/google'

export const Bricolage_Grotesque = FontBricolage({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
  preload: true,
})