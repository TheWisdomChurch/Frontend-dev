'use client';

import React, { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { useTheme } from '@/shared/contexts/ThemeContext';
import HeroHighlights from '@/features/hero/HeroHighlights';
import EventsShowcase from '@/features/events/EventsShowcase';
import JoinUs from '@/features/events/JoinUs';
import ResourceSection from '@/features/resources/Resource';
import { apiClient } from '@/lib/api';

const HeroMain = nextDynamic(() => import('@/features/hero/HeroMain'), {
  ssr: true,
  loading: () => <div className="h-[500px] animate-pulse bg-slate-900" />,
});

const WhatWeDo = nextDynamic(() => import('@/features/WhatWeDo'), {
  ssr: true,
  loading: () => <div className="h-[400px] animate-pulse bg-slate-900" />,
});

const SeniorPastor = nextDynamic(
  () => import('@/features/leadership/SeniorPastor'),
  {
    ssr: true,
    loading: () => <div className="h-[350px] animate-pulse bg-slate-900" />,
  }
);

const Testimonials = nextDynamic(
  () => import('@/features/testimonials/Testimonials'),
  {
    ssr: true,
    loading: () => <div className="h-[400px] animate-pulse bg-slate-900" />,
  }
);

const OnlineGiving = nextDynamic(
  () => import('@/features/events/OnlineGiving'),
  {
    ssr: true,
    loading: () => <div className="h-[350px] animate-pulse bg-slate-900" />,
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
  const theme = useTheme();
  const colorScheme = theme?.colorScheme;

  const [showModal, setShowModal] = useState(false);
  const [nextAdAt, setNextAdAt] = useState<number | null>(null);
  const [showConfessionPopup, setShowConfessionPopup] = useState(true);
  const [eventAd, setEventAd] = useState<HomeEventAd>(fallbackEventAd);
  const [confessionContent, setConfessionContent] =
    useState<HomeConfessionContent | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadHomepageContent = async () => {
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
    };

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
    const autoOpenDelayMs = 1200;
    setNextAdAt(Date.now() + autoOpenDelayMs);
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
    const closeCooldownMs = 1000 * 60 * 20;
    persistAdCooldown(closeCooldownMs);
    setShowModal(false);
  };

  const handleRemindLater = () => {
    const remindCooldownMs = 1000 * 60 * 45;
    persistAdCooldown(remindCooldownMs);
    setShowModal(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505]">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${
            colorScheme?.opacity?.primary20 || 'rgba(247,222,18,0.2)'
          } 0%, transparent 45%), radial-gradient(circle at 80% 10%, ${
            colorScheme?.opacity?.primary10 || 'rgba(247,222,18,0.1)'
          } 0%, transparent 40%), radial-gradient(circle at 50% 90%, ${
            colorScheme?.opacity?.primary10 || 'rgba(247,222,18,0.1)'
          } 0%, transparent 40%)`,
          filter: 'blur(60px)',
        }}
        data-parallax-global="0.2"
      />

      <main className="w-full flex-1">
        <div className="flex flex-col">
          <HeroMain />

          <div data-gsap="reveal">
            <HeroHighlights />
          </div>

          <div data-gsap="reveal">
            <WhatWeDo />
          </div>

          <div data-gsap="reveal">
            <EventsShowcase />
          </div>

          <div data-gsap="reveal">
            <SeniorPastor />
          </div>

          <div id="join">
            <div data-gsap="reveal">
              <JoinUs />
            </div>
          </div>

          <div data-gsap="reveal">
            <Testimonials />
          </div>

          <div id="give" data-gsap="reveal">
            <OnlineGiving />
          </div>

          <div data-gsap="reveal">
            <ResourceSection />
          </div>
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
            className="fixed bottom-4 right-4 z-[9900] inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-3.5 py-2.5 text-[11px] font-medium text-white shadow-2xl backdrop-blur-lg transition duration-300 hover:-translate-y-0.5 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:bottom-5 sm:px-4 sm:text-sm"
            style={{ animation: 'fade-up-keyframe 0.5s ease-out' }}
          >
            <span className="text-lg">📢</span>
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
      </main>
    </div>
  );
}
