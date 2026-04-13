// app/ClientRoot.tsx
'use client';

import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { HeaderProvider } from '@/components/providers/NavProviders';
import ReduxProvider from '@/components/providers/ReduxProvider';
import ClientHeader from '@/components/common/ClientHeader';
import ClientFooter from '@/components/common/ClientFooter';
import ClientScrollToTop from '@/components/common/ClientscrollTop';
import ScrollHandler from '@/components/common/ClientScrollHandler';

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
          <main className="flex-1">{children}</main>
          <ClientScrollToTop />
        </HeaderProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
