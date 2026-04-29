'use client';

import { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { useTheme } from '@/shared/contexts/ThemeContext';
import HeroHighlights from '@/features/hero/HeroHighlights';
import EventsShowcase from '@/features/events/EventsShowcase';
import JoinUs from '@/features/events/JoinUs';
import ResourceSection from '@/features/resources/Resource';
import { apiClient } from '@/lib/api';

const SectionFallback = ({ height = 'min-h-[360px]' }: { height?: string }) => (
  <div className={`w-full ${height} animate-pulse bg-[#080808]`} />
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
  const { colorScheme } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [nextAdAt, setNextAdAt] = useState<number | null>(null);
  const [showConfessionPopup, setShowConfessionPopup] = useState(true);
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#050505] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          background: `
            radial-gradient(circle at 18% 12%, ${
              colorScheme?.opacity?.primary20 || 'rgba(247,222,18,0.18)'
            } 0%, transparent 34%),
            radial-gradient(circle at 82% 4%, ${
              colorScheme?.opacity?.primary10 || 'rgba(247,222,18,0.10)'
            } 0%, transparent 30%),
            linear-gradient(180deg, #050505 0%, #070707 48%, #050505 100%)
          `,
        }}
      />

      <div className="relative z-10 flex w-full flex-col">
        <HeroMain />

        <section className="home-section" data-gsap="reveal">
          <HeroHighlights />
        </section>

        <section className="home-section" data-gsap="reveal">
          <WhatWeDo />
        </section>

        <section className="home-section" data-gsap="reveal">
          <EventsShowcase />
        </section>

        <section className="home-section" data-gsap="reveal">
          <SeniorPastor />
        </section>

        <section
          id="join"
          className="home-section scroll-mt-24"
          data-gsap="reveal"
        >
          <JoinUs />
        </section>

        <section className="home-section" data-gsap="reveal">
          <Testimonials />
        </section>

        <section
          id="give"
          className="home-section scroll-mt-24"
          data-gsap="reveal"
        >
          <OnlineGiving />
        </section>

        <section className="home-section" data-gsap="reveal">
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
        <button
          type="button"
          aria-label="Open conference registration ad"
          onClick={() => setShowModal(true)}
          className="fixed bottom-4 right-4 z-[9900] inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-3.5 py-2.5 text-[11px] font-semibold text-white shadow-2xl backdrop-blur-lg transition duration-300 hover:-translate-y-0.5 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7de12] sm:bottom-5 sm:px-4 sm:text-sm"
        >
          <span className="text-base">📢</span>
          <span>WPC 2026</span>
        </button>
      )}

      {!showModal && showConfessionPopup && (
        <ConfessionPopup
          onClose={() => setShowConfessionPopup(false)}
          delay={1800}
          content={confessionContent ?? undefined}
        />
      )}
    </div>
  );
}
