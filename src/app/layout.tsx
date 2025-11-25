// app/layout.tsx
import type { Metadata } from 'next';
import {
  bricolageGrotesque,
  worksans,
  playfair,
} from '@/components/fonts/fonts';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { HeaderProvider } from '@/components/providers/NavProviders';
import ReduxProvider from '@/components/providers/ReduxProvider';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import ClientHeader from '@/components/layout/ClientHeader';
import ClientFooter from '@/components/layout/ClientFooter';
import ClientScrollToTop from '@/components/layout/ClientscrollTop';
import ScrollHandler from '@/components/layout/ClientScrollHandler';
import './globals.css';
import RouteLoaderProvider from '@/components/providers/RouteProvider';

export const metadata: Metadata = {
  title: 'The Wisdomhouse Church',
  description: 'Wisdom HouseHq - We Are Transformed',
};

// Client wrapper component that contains all client-side providers
// Client wrapper component that contains all client-side providers
function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <HeaderProvider>
          <ErrorBoundary>
            <ScrollHandler />
            <RouteLoaderProvider>
              <ClientHeader />
              <main className="flex-1 flex flex-col min-h-screen">
                {children}
              </main>
              <ClientFooter />
              <ClientScrollToTop />
            </RouteLoaderProvider>
          </ErrorBoundary>
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
      <body className={bricolageGrotesque.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
