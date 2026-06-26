'use client';

import { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { apiClient } from '@/lib/api';

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

const fallbackEventAd: HomeEventAd = {
  id: 'wpc-2026',
  title: 'Wisdom Power Conference 2026',
  headline: 'Have you registered for WPC 2026?',
  description:
    'Join three days of worship, impartation, and encounters designed to refresh your spirit and strengthen your walk.',
  startAt: '2026-03-20T18:00:00Z',
  endAt: '2026-03-22T20:00:00Z',
  time: 'Morning Session • Evening Session',
  location: 'Honor Gardens opposite Dominion City, Alasia Bus stop',
  image: '/HEADER.webp',
  registerUrl: 'https://admin.wisdomchurchhq.org/forms/wpc26',
  ctaLabel: 'Register now',
  note: 'You will be returned to the main website after you finish.',
};

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [nextAdAt, setNextAdAt] = useState<number | null>(null);
  const [showConfessionPopup, setShowConfessionPopup] = useState(false);
  const [eventAd, setEventAd] = useState<HomeEventAd>(fallbackEventAd);
  const [confessionContent, setConfessionContent] =
    useState<HomeConfessionContent | null>(null);

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
          setEventAd(prev => ({
            ...prev,
            ...(adPayload as Partial<HomeEventAd>),
          }));
        }

        if (confessionPayload && typeof confessionPayload === 'object') {
          setConfessionContent({
            welcomeTitle:
              String(confessionPayload.welcomeTitle || '').trim() ||
              'Welcome Home',
            welcomeMessage:
              String(confessionPayload.welcomeMessage || '').trim() ||
              'You are in a place of worship, truth, and transformation.',
            confessionText:
              String(confessionPayload.confessionText || '').trim() || '',
            motto:
              String(confessionPayload.motto || '').trim() ||
              'We begin to prosper, we continue to prosper, until we become very prosperous.',
          });
        }
      } catch (error) {
        console.warn('Failed to load homepage content:', error);
      }
    }

    const t = window.setTimeout(loadHomepageContent, 800);
    return () => {
      mounted = false;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('home-page');

    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  useEffect(() => {
    setNextAdAt(Date.now() + 1200);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowConfessionPopup(true);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (nextAdAt === null) return;

    const timeLeft = nextAdAt - Date.now();

    if (timeLeft <= 0) {
      setShowModal(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowModal(true);
    }, timeLeft);

    return () => window.clearTimeout(timer);
  }, [nextAdAt]);

  const persistAdCooldown = (cooldownMs: number) => {
    setNextAdAt(Date.now() + cooldownMs);
  };

  const handleCloseModal = () => {
    persistAdCooldown(1000 * 60 * 20);
    setShowModal(false);
  };

  const handleRemindLater = () => {
    persistAdCooldown(1000 * 60 * 45);
    setShowModal(false);
  };

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

      <EventAdModal
        open={showModal}
        event={eventAd}
        onClose={handleCloseModal}
        onRemindLater={handleRemindLater}
      />

      {showConfessionPopup && (
        <ConfessionPopup
          onClose={() => setShowConfessionPopup(false)}
          delay={0}
          content={confessionContent ?? undefined}
        />
      )}
    </div>
  );
}
