'use client';

import { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { Button } from '@/shared/utils/buttons';
import HeroHighlights from '@/features/hero/HeroHighlights';
import EventsShowcase from '@/features/events/EventsShowcase';
import JoinUs from '@/features/events/JoinUs';
import ResourceSection from '@/features/resources/Resource';
import { apiClient } from '@/lib/api';

const SectionFallback = ({ height = 'min-h-[360px]' }: { height?: string }) => (
  <div className={`w-full ${height} animate-pulse bg-[var(--app-surface-2)]`} />
);

const HeroMain = nextDynamic(() => import('@/features/hero/HeroMain'), {
  ssr: true,
  loading: () => <SectionFallback height="min-h-[72svh]" />,
});

const WhatWeDo = nextDynamic(() => import('@/features/WhatWeDo'), {
  ssr: true,
  loading: () => <SectionFallback />,
});

const SeniorPastor = nextDynamic(
  () => import('@/features/leadership/SeniorPastor'),
  {
    ssr: true,
    loading: () => <SectionFallback />,
  }
);

const Testimonials = nextDynamic(
  () => import('@/features/testimonials/Testimonials'),
  {
    ssr: true,
    loading: () => <SectionFallback />,
  }
);

const OnlineGiving = nextDynamic(
  () => import('@/features/events/OnlineGiving'),
  {
    ssr: true,
    loading: () => <SectionFallback />,
  }
);

const EventAdModal = nextDynamic(
  () => import('@/shared/ui/modals/EventAdModal'),
  {
    ssr: false,
    loading: () => null,
  }
);

const ConfessionPopup = nextDynamic(
  () => import('@/shared/ui/modals/ConfessionPopup'),
  {
    ssr: false,
    loading: () => null,
  }
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

  useEffect(() => {
    setNextAdAt(Date.now() + 1200);
  }, []);

  useEffect(() => {
    const alreadyWelcomed =
      typeof window !== 'undefined' && localStorage.getItem('wisdom_welcomed');
    if (alreadyWelcomed) return;

    const timer = window.setTimeout(() => {
      setShowConfessionPopup(true);
    }, 10000);

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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[var(--app-surface)] text-white">
      <div
        aria-hidden="true"
        className="home-page-glow pointer-events-none fixed inset-0 z-0 opacity-60"
      />

      <div className="relative z-10 flex w-full flex-col">
        <HeroMain />

        <section className="home-section" data-gsap="reveal">
          <HeroHighlights />
        </section>

        <section className="home-section perf-section" data-gsap="reveal">
          <WhatWeDo />
        </section>

        <section className="home-section perf-section" data-gsap="reveal">
          <EventsShowcase />
        </section>

        <section className="home-section perf-section" data-gsap="reveal">
          <SeniorPastor />
        </section>

        <section
          id="join"
          className="home-section perf-section scroll-mt-24"
          data-gsap="reveal"
        >
          <JoinUs />
        </section>

        <section className="home-section perf-section" data-gsap="reveal">
          <Testimonials />
        </section>

        <section
          id="giving"
          className="home-section perf-section scroll-mt-24"
          data-gsap="reveal"
        >
          <OnlineGiving />
        </section>

        <section className="home-section perf-section" data-gsap="reveal">
          <ResourceSection />
        </section>
      </div>

      <EventAdModal
        open={showModal}
        event={eventAd}
        onClose={handleCloseModal}
        onRemindLater={handleRemindLater}
      />

      {!showModal && (
        <Button
          type="button"
          variant="ghost"
          curvature="full"
          aria-label="Open conference registration ad"
          onClick={() => setShowModal(true)}
          className="fixed bottom-4 right-4 z-[9900] gap-2 border border-white/15 bg-black/80 px-3.5 py-2.5 text-[11px] font-semibold text-white shadow-2xl backdrop-blur-lg hover:-translate-y-0.5 hover:bg-black sm:bottom-5 sm:px-4 sm:text-sm"
        >
          <span className="text-base">📢</span>
          <span>WPC 2026</span>
        </Button>
      )}

      {!showModal && showConfessionPopup && (
        <ConfessionPopup
          onClose={() => {
            setShowConfessionPopup(false);
            if (typeof window !== 'undefined') {
              localStorage.setItem('wisdom_welcomed', 'true');
            }
          }}
          delay={0}
          content={confessionContent ?? undefined}
        />
      )}
    </div>
  );
}
