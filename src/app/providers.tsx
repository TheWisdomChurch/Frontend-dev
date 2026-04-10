'use client';

import { ReactNode } from 'react';
import { AnalyticsProvider } from '@/shared/providers/AnalyticsProvider';
import { NotificationProvider } from '@/shared/contexts/NotificationContext';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';
import { ServiceUnavailableProvider } from '@/shared/contexts/ServiceUnavailableContext';
import { HeaderProvider } from '@/shared/providers/NavProviders';
import ReduxProvider from '@/shared/providers/ReduxProvider';
import AppStartupLoader from '@/shared/providers/AppStartupLoader';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import ClientHeader from '@/shared/components/ClientHeader';
import ClientFooter from '@/shared/components/ClientFooter';
import ClientScrollToTop from '@/shared/components/ClientscrollTop';
import ScrollHandler from '@/shared/components/ClientScrollHandler';
import CookieConsentBanner from '@/shared/ui/CookieConsentBanner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AnalyticsProvider
      metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
      gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
      debug={false}
    >
      <ReduxProvider>
        <ThemeProvider>
          <NotificationProvider>
            <ServiceUnavailableProvider>
              <HeaderProvider>
                <ErrorBoundary>
                  <AppStartupLoader />
                  <ScrollHandler />
                  <ClientHeader />
                  <main className="flex-1 flex flex-col min-h-screen page-gsap page-shell">
                    {children}
                  </main>
                  <ClientFooter />
                  <ClientScrollToTop />
                  <CookieConsentBanner />
                </ErrorBoundary>
              </HeaderProvider>
            </ServiceUnavailableProvider>
          </NotificationProvider>
        </ThemeProvider>
      </ReduxProvider>
    </AnalyticsProvider>
  );
}
