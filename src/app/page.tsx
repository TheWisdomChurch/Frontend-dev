'use client';

import { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { apiClient } from '@/lib/api';
import { usePromoModalQueue } from '@/hooks';

const SectionFallback = ({ height = 'min-h-[360px]' }: { height?: string }) => (
  <div className={`w-full ${height} bg-[var(--app-surface-2)]`} />
);

const HeroMain = nextDynamic(() => import('@/features/hero/HeroMain'), {
  ssr: true,
  loading: () => <SectionFallback height="min-h-[72svh]" />,
});

const HeroHighlights = nextDynamic(
  () => import('@/features/hero/HeroHighlights'),
  { ssr: false, loading: () => <SectionFallback height="min-h-[220px]" /> }
);

const WhatWeDo = nextDynamic(() => import('@/features/WhatWeDo'), {
  ssr: false,
  loading: () => <SectionFallback />,
});

const EventsShowcase = nextDynamic(
  () => import('@/features/events/EventsShowcase'),
  { ssr: false, loading: () => <SectionFallback /> }
);

const SeniorPastor = nextDynamic(
  () => import('@/features/leadership/SeniorPastor'),
  { ssr: false, loading: () => <SectionFallback /> }
);

const JoinUs = nextDynamic(() => import('@/features/events/JoinUs'), {
  ssr: false,
  loading: () => <SectionFallback />,
});

const HomeTestimonials = nextDynamic(
  () => import('@/features/testimonials/HomeTestimonials'),
  { ssr: false, loading: () => <SectionFallback /> }
);

const ConnectPortal = nextDynamic(
  () => import('@/features/connect/ConnectPortal'),
  { ssr: false, loading: () => <SectionFallback height="min-h-[520px]" /> }
);

const OnlineGiving = nextDynamic(
  () => import('@/features/events/OnlineGiving'),
  { ssr: false, loading: () => <SectionFallback /> }
);

const ResourceSection = nextDynamic(
  () => import('@/features/resources/Resource'),
  { ssr: false, loading: () => <SectionFallback /> }
);

const EventAdModal = nextDynamic(
  () => import('@/shared/ui/modals/EventAdModal'),
  { ssr: false, loading: () => null }
);

const DailyPrayerAdModal = nextDynamic(
  () => import('@/shared/ui/modals/DailyPrayerAdModal'),
  { ssr: false, loading: () => null }
);

const ConfessionPopup = nextDynamic(
  () => import('@/shared/ui/modals/ConfessionPopup'),
  { ssr: false, loading: () => null }
);

type HomeEventAd = {
  id: string;
  title: string;
  headline: string;
  description: string;
  startAt: string;
  endAt: string;
  time: string;
  location: string;
  image: string;
  registerUrl: string;
  ctaLabel: string;
  note: string;
};

type HomeConfessionContent = {
  welcomeTitle: string;
  welcomeMessage: string;
  confessionText: string;
  motto: string;
};

export default function Home() {
  const [eventAd, setEventAd] = useState<HomeEventAd | null>(null);
  const [confessionContent, setConfessionContent] =
    useState<HomeConfessionContent | null>(null);

  const { active: activePromoModal, closeActive: closePromoModal } =
    usePromoModalQueue({ eventAdAvailable: eventAd !== null });

  useEffect(() => {
    let mounted = true;

    async function loadHomepageContent() {
      try {
        const [adPayload, confessionPayload] = await Promise.all([
          apiClient.getHomepageAd(),
          apiClient.getConfessionContent(),
        ]);

        if (!mounted) return;

        if (adPayload && typeof adPayload === 'object') {
          const ad = adPayload as Record<string, unknown>;
          const title = String(ad.title || '').trim();

          // Only show the ad once the API actually gives us a title —
          // otherwise there's nothing real to advertise.
          if (title) {
            setEventAd({
              id: String(ad.id || '').trim(),
              title,
              headline: String(ad.headline || '').trim(),
              description: String(ad.description || '').trim(),
              startAt: String(ad.startAt || '').trim(),
              endAt: String(ad.endAt || '').trim(),
              time: String(ad.time || '').trim(),
              location: String(ad.location || '').trim(),
              image: String(ad.image || '').trim(),
              registerUrl: String(ad.registerUrl || '').trim(),
              ctaLabel: String(ad.ctaLabel || '').trim() || 'Register now',
              note: String(ad.note || '').trim(),
            });
          }
        }

        if (confessionPayload && typeof confessionPayload === 'object') {
          // Pass through whatever the API actually returned — empty fields
          // fall through to ConfessionPopup's own real default copy rather
          // than being padded with fabricated text here.
          setConfessionContent({
            welcomeTitle: String(confessionPayload.welcomeTitle || '').trim(),
            welcomeMessage: String(
              confessionPayload.welcomeMessage || ''
            ).trim(),
            confessionText: String(
              confessionPayload.confessionText || ''
            ).trim(),
            motto: String(confessionPayload.motto || '').trim(),
          });
        }
      } catch (error) {
        console.warn('Failed to load homepage content:', error);
      }
    }

    loadHomepageContent();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('home-page');

    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[var(--app-surface)] text-[var(--app-text)]">
      <div className="relative flex w-full flex-col">
        <HeroMain />

        <section
          className="home-section"
          data-gsap="reveal"
          suppressHydrationWarning
        >
          <HeroHighlights />
        </section>

        <section
          className="home-section perf-section"
          data-gsap="reveal"
          suppressHydrationWarning
        >
          <WhatWeDo />
        </section>

        <section
          className="home-section perf-section"
          data-gsap="reveal"
          suppressHydrationWarning
        >
          <EventsShowcase />
        </section>

        <section
          className="home-section perf-section"
          data-gsap="reveal"
          suppressHydrationWarning
        >
          <SeniorPastor />
        </section>

        <section
          id="join"
          className="home-section perf-section scroll-mt-24"
          data-gsap="reveal"
          suppressHydrationWarning
        >
          <JoinUs />
        </section>

        <section
          className="home-section perf-section"
          data-gsap="reveal"
          suppressHydrationWarning
        >
          <ConnectPortal />
        </section>

        <section
          className="home-section perf-section"
          data-gsap="reveal"
          suppressHydrationWarning
        >
          <HomeTestimonials />
        </section>

        <section
          id="giving"
          className="home-section perf-section scroll-mt-24"
          data-gsap="reveal"
          suppressHydrationWarning
        >
          <OnlineGiving />
        </section>

        <section
          className="home-section perf-section"
          data-gsap="reveal"
          suppressHydrationWarning
        >
          <ResourceSection />
        </section>
      </div>

      {eventAd && (
        <EventAdModal
          open={activePromoModal === 'event'}
          event={eventAd}
          onClose={() => closePromoModal(false)}
          onRemindLater={() => closePromoModal(true)}
        />
      )}

      <DailyPrayerAdModal
        open={activePromoModal === 'dailyPrayer'}
        onClose={() => closePromoModal()}
        onRemindTomorrow={() => closePromoModal()}
      />

      <ConfessionPopup
        open={activePromoModal === 'confession'}
        onClose={() => closePromoModal()}
        content={confessionContent ?? undefined}
      />
    </div>
  );
}
