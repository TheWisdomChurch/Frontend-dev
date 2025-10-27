import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { bricolageGrotesque } from '@/components/fonts/fonts';
// import { bricolageGrotesque } from './lib/fonts/fonts';

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolageGrotesque.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
