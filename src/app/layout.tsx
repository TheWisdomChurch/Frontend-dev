import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { HeaderProvider } from '@/components/providers/NavProviders';
import ReduxProvider from '@/components/providers/ReduxProvider'; // Add this import
import {
  bricolageGrotesque,
  worksans,
  playfair,
} from '@/components/fonts/fonts';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'The Wisdomhouse Church',
  description: 'Wisdom HouseHq - We Are Transformed',
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
      <body
        className={`${bricolageGrotesque.className} flex flex-col min-h-screen`}
      >
        {/* Wrap everything with ReduxProvider */}
        <ReduxProvider>
          <ThemeProvider>
            {/* Wrap with HeaderProvider */}
            <HeaderProvider>
              {/* Header at the top */}
              <Header />

              {/* Main content grows to fill space */}
              <main className="flex-1">{children}</main>

              {/* Footer at the bottom */}
              <Footer />
            </HeaderProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
