// app/layout.tsx
import type { Metadata } from 'next';

import { ThemeProvider } from '../../contexts/ThemeContext';
import { bricolageGrotesque } from '../../lib/fonts/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: 'Wisdom House',
  description: 'Wisdom House frontend web app',
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
