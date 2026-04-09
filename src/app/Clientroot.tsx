// app/ClientRoot.tsx
'use client';

import { ThemeProvider } from '@/shared/contexts/ThemeContext';
import { HeaderProvider } from '@/shared/providers/NavProviders';
import ReduxProvider from '@/shared/providers/ReduxProvider';
import ClientHeader from '@/shared/components/ClientHeader';
import ClientFooter from '@/shared/components/ClientFooter';
import ClientScrollToTop from '@/shared/components/ClientscrollTop';
import ScrollHandler from '@/shared/components/ClientScrollHandler';

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
