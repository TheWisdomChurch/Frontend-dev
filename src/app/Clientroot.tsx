// app/ClientRoot.tsx
'use client';

import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { HeaderProvider } from '@/components/providers/NavProviders';
import ReduxProvider from '@/components/providers/ReduxProvider';
import ClientHeader from '@/components/layout/ClientHeader';
import ClientFooter from '@/components/layout/ClientFooter';
import ClientScrollToTop from '@/components/layout/ClientscrollTop';
import ScrollHandler from '@/components/layout/ClientScrollHandler';

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
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
