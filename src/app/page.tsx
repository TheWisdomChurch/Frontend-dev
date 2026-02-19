// app/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/ui/Homepage/heromain';
import HeroHighlights from '@/components/ui/Homepage/HeroHighlights';
import EventAdModal from '@/components/ui/Homepage/EventAdModal';
import ConfessionPopup from '@/components/ui/ConfessionPopup';
import MobileDebug from '@/components/utils/mobileDebug';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Megaphone } from 'lucide-react';

const WhatWeDo = dynamic(() => import('@/components/ui/Homepage/WhatWeDo'), {
  ssr: true,
  loading: () => null,
});
const EventsShowcase = dynamic(
  () => import('@/components/ui/Homepage/EventsShowcase'),
  { ssr: true, loading: () => null }
);
const SeniorPastor = dynamic(() => import('@/components/ui/Homepage/SeniorPastor'), {
  ssr: true,
  loading: () => null,
});
// const AssociatePastors = dynamic(
//   () => import('@/components/ui/Homepage/AssociatePastors'),
//   { ssr: true, loading: () => <div className="min-h-[220px]" /> }
// );
const JoinWisdomHouse = dynamic(() => import('@/components/ui/Homepage/JoinUs'), {
  ssr: true,
  loading: () => null,
});
const Testimonial = dynamic(() => import('@/components/ui/Homepage/Testimonials'), {
  ssr: true,
  loading: () => null,
});
const OnlineGiving = dynamic(() => import('@/components/ui/Homepage/OnlineGiving'), {
  ssr: true,
  loading: () => null,
});
const ResourceSection = dynamic(() => import('@/components/ui/Homepage/Resource'), {
  ssr: true,
  loading: () => null,
});

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [nextAdAt, setNextAdAt] = useState<number | null>(null);
  const [showConfessionPopup, setShowConfessionPopup] = useState(true);
  const { colorScheme } = useTheme();

  const eventStorageKey = 'wc_event_ad_next_show_session_v2';
  const autoOpenDelayMs = 1200;
  const closeCooldownMs = 1000 * 60 * 20;
  const remindCooldownMs = 1000 * 60 * 45;

  const eventAd = useMemo(
    () => ({
      id: 'wpc-2026',
      title: 'Wisdom Power Conference 2026',
      headline: 'Have you registered for WPC 2026?',
      description:
        'Join three days of worship, impartation, and encounters designed to refresh your spirit and strengthen your walk.',
      startAt: '2026-03-20T18:00:00Z',
      endAt: '2026-03-22T20:00:00Z',
      time: '6:00 PM Daily',
      location: 'Honor Gardens opposite Dominion City, Alasia Bus stop',
      image: '/HEADER.png',
      registerUrl: 'https://admin.wisdomchurchhq.org/forms/wpc26',
      ctaLabel: 'Register now',
      note: 'You will be returned to the main website after you finish.',
    }),
    []
  );

  useEffect(() => {
    const now = Date.now();
    const nextAllowedRaw =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem(eventStorageKey)
        : null;
    const nextAllowed = nextAllowedRaw ? Number(nextAllowedRaw) : 0;

    if (Number.isFinite(nextAllowed) && now < nextAllowed) {
      setNextAdAt(nextAllowed);
      return;
    }

    setNextAdAt(now + autoOpenDelayMs);
  }, [autoOpenDelayMs, eventStorageKey]);

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
    const nextAllowedAt = Date.now() + cooldownMs;
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(eventStorageKey, String(nextAllowedAt));
    }
    setNextAdAt(nextAllowedAt);
  };

  const handleCloseModal = () => {
    persistAdCooldown(closeCooldownMs);
    setShowModal(false);
  };

  const handleRemindLater = () => {
    persistAdCooldown(remindCooldownMs);
    setShowModal(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505]">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${colorScheme.opacity.primary20} 0%, transparent 45%), radial-gradient(circle at 80% 10%, ${colorScheme.opacity.primary10} 0%, transparent 40%), radial-gradient(circle at 50% 90%, ${colorScheme.opacity.primary10} 0%, transparent 40%)`,
          filter: 'blur(60px)',
        }}
        data-parallax-global="0.2"
      />
      <main className="flex-1 w-full">
        {process.env.NODE_ENV === 'development' && <MobileDebug />}

        <div className="flex flex-col">
          <HeroSection />
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
          {/* <div data-gsap="reveal">
            <AssociatePastors />
          </div> */}
          <div id="join">
            <div data-gsap="reveal">
              <JoinWisdomHouse />
            </div>
          </div>
          <div data-gsap="reveal">
            <Testimonial />
          </div>
          <div data-gsap="reveal">
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
            className="fixed bottom-5 right-4 z-[9900] inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2.5 text-xs font-medium text-white shadow-2xl backdrop-blur-lg transition hover:-translate-y-0.5 hover:bg-black sm:text-sm"
          >
            <Megaphone className="h-4 w-4" style={{ color: colorScheme.primary }} />
            <span>WPC 2026</span>
          </button>
        )}

        {!showModal && showConfessionPopup && (
          <ConfessionPopup
            onClose={() => setShowConfessionPopup(false)}
            delay={1800}
          />
        )}
      </main>
    </div>
  );
}
