'use client';

import { ReactNode } from 'react';
import { AnalyticsProvider } from '@/shared/providers/AnalyticsProvider';
import { NotificationProvider } from '@/shared/contexts/NotificationContext';
import { ServiceUnavailableProvider } from '@/shared/contexts/ServiceUnavailableContext';
import { HeaderProvider } from '@/shared/providers/NavProviders';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import ClientHeader from '@/shared/components/ClientHeader';
import ClientFooter from '@/shared/components/ClientFooter';
import ClientScrollToTop from '@/shared/components/ClientscrollTop';
import ScrollHandler from '@/shared/components/ClientScrollHandler';
import CookieConsentBanner from '@/shared/ui/CookieConsentBanner';
import GlobalScrollEffects from '@/shared/components/GlobalScrollEffects';
import PageTipHost from '@/shared/components/PageTipHost';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AnalyticsProvider
      metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
      gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
      debug={false}
    >
      <NotificationProvider>
        <ServiceUnavailableProvider>
          <HeaderProvider>
            <ErrorBoundary>
              <ScrollHandler />
              <GlobalScrollEffects />

              <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--app-surface)] text-[var(--app-text)]">
                <ClientHeader />

                <div className="page-shell page-gsap relative min-h-[calc(100svh-1px)] w-full flex-1 overflow-x-hidden">
                  {children}
                </div>

                <ClientFooter />
              </div>

              <ClientScrollToTop />
              <CookieConsentBanner />
              <PageTipHost />
            </ErrorBoundary>
          </HeaderProvider>
        </ServiceUnavailableProvider>
      </NotificationProvider>
    </AnalyticsProvider>
  );
}
