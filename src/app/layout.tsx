// app/layout.tsx
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { HeaderProvider } from '@/components/providers/NavProviders';
import ReduxProvider from '@/components/providers/ReduxProvider';
import {
  bricolageGrotesque,
  worksans,
  playfair,
} from '@/components/fonts/fonts';
import './globals.css';
import ClientHeader from '@/components/layout/ClientHeader';

import ClientFooter from '@/components/layout/ClientFooter';
import ClientScrollToTop from '@/components/layout/ClientscrollTop';
import ScrollHandler from '@/components/layout/ClientScrollHandler';

export const metadata: Metadata = {
  title: 'The Wisdomhouse Church',
  description: 'Wisdom HouseHq - We Are Transformed',
};

// Client wrapper component that contains all client-side providers
function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <HeaderProvider>
          <ScrollHandler />
          <ClientHeader />
          <main className="flex-1">{children}</main>
          <ClientFooter />
          <ClientScrollToTop />
        </HeaderProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

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
      <body
        className={`${bricolageGrotesque.className} flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
