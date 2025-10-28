import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import {
  bricolageGrotesque,
  worksans,
  playfair,
} from '@/components/fonts/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Lighthouse Church',
  description: 'Lighthouse Church of God - We Are Transformed',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${worksans.variable} ${playfair.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className={bricolageGrotesque.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
