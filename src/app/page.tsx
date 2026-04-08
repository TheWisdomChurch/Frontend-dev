'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from '@/components/contexts/ThemeContext';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

// ============================================================================
// DYNAMIC IMPORTS - Using reorganized feature components
// ============================================================================

const HeroMain = dynamic(() => import('@/components/features/hero/HeroMain'), {
  ssr: true,
  loading: () => null,
});

const HeroHighlights = dynamic(
  () => import('@/components/features/hero/HeroHighlights'),
  {
    ssr: true,
    loading: () => null,
  }
);

const WhatWeDo = dynamic(() => import('@/components/features/WhatWeDo'), {
  ssr: true,
  loading: () => null,
});

const EventsShowcase = dynamic(
  () => import('@/components/features/events/EventsShowcase'),
  { ssr: true, loading: () => null }
);

const SeniorPastor = dynamic(
  () => import('@/components/features/leadership/SeniorPastor'),
  { ssr: true, loading: () => null }
);

const JoinUs = dynamic(() => import('@/components/features/events/JoinUs'), {
  ssr: true,
  loading: () => null,
});

const Testimonials = dynamic(
  () => import('@/components/features/testimonials/Testimonials'),
  { ssr: true, loading: () => null }
);

const OnlineGiving = dynamic(
  () => import('@/components/features/events/OnlineGiving'),
  { ssr: true, loading: () => null }
);

const ResourceSection = dynamic(
  () => import('@/components/features/resources/Resource'),
  { ssr: true, loading: () => null }
);

const EventAdModal = dynamic(
  () => import('@/components/ui/modals/EventAdModal'),
  {
    ssr: false,
    loading: () => null,
  }
);

const ConfessionPopup = dynamic(
  () => import('@/components/ui/modals/ConfessionPopup'),
  {
    ssr: false,
    loading: () => null,
  }
);

// ============================================================================
// HOMEPAGE COMPONENT
// ============================================================================

export default function Home() {
  const { colorScheme } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [nextAdAt, setNextAdAt] = useState<number | null>(null);
  const [showConfessionPopup, setShowConfessionPopup] = useState(true);

  const eventStorageKey = 'wc_event_ad_next_show_session_v2';
  const autoOpenDelayMs = 1200;
  const closeCooldownMs = 1000 * 60 * 20;
  const remindCooldownMs = 1000 * 60 * 45;

  // Event advertising modal data
  const eventAd = useMemo(
    () => ({
      id: 'wpc-2026',
      title: 'Wisdom Power Conference 2026',
      headline: 'Have you registered for WPC 2026?',
      description:
        'Join three days of worship, impartation, and encounters designed to refresh your spirit and strengthen your walk.',
      startAt: '2026-03-20T18:00:00Z',
      endAt: '2026-03-22T20:00:00Z',
      time: 'Morning Session • Evening Session',
      location: 'Honor Gardens opposite Dominion City, Alasia Bus stop',
      image: '/HEADER.png',
      registerUrl: 'https://admin.wisdomchurchhq.org/forms/wpc26',
      ctaLabel: 'Register now',
      note: 'You will be returned to the main website after you finish.',
    }),
    []
  );

  // Initialize modal timing on mount
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

  // Setup modal auto-open timer
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

  // Cooldown persistence for modal
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
      {/* Animated background gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${colorScheme?.opacity?.primary20 || 'rgba(247,222,18,0.2)'} 0%, transparent 45%), radial-gradient(circle at 80% 10%, ${colorScheme?.opacity?.primary10 || 'rgba(247,222,18,0.1)'} 0%, transparent 40%), radial-gradient(circle at 50% 90%, ${colorScheme?.opacity?.primary10 || 'rgba(247,222,18,0.1)'} 0%, transparent 40%)`,
          filter: 'blur(60px)',
        }}
        data-parallax-global="0.2"
      />

      <Header />

      <main className="flex-1 w-full">
        <div className="flex flex-col">
          {/* Hero Section with video background */}
          <HeroMain />

          {/* Hero Highlights Section */}
          <div data-gsap="reveal">
            <HeroHighlights />
          </div>

          {/* What We Do Section */}
          <div data-gsap="reveal">
            <WhatWeDo />
          </div>

          {/* Events Showcase - Fetches from API */}
          <div data-gsap="reveal">
            <EventsShowcase />
          </div>

          {/* Senior Pastor Message Section */}
          <div data-gsap="reveal">
            <SeniorPastor />
          </div>

          {/* Call to Action - Join Us */}
          <div id="join">
            <div data-gsap="reveal">
              <JoinUs />
            </div>
          </div>

          {/* Testimonials Section - Fetches from API */}
          <div data-gsap="reveal">
            <Testimonials />
          </div>

          {/* Online Giving Section */}
          <div data-gsap="reveal">
            <OnlineGiving />
          </div>

          {/* Resources Section */}
          <div data-gsap="reveal">
            <ResourceSection />
          </div>
        </div>

        {/* Event Advertisement Modal */}
        <EventAdModal
          open={showModal}
          event={eventAd}
          onClose={handleCloseModal}
          onRemindLater={handleRemindLater}
        />

        {/* WPC 2026 Float Button */}
        {!showModal && (
          <button
            type="button"
            aria-label="Open conference registration ad"
            onClick={() => setShowModal(true)}
            className="fixed bottom-4 right-4 sm:bottom-5 z-[9900] inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-3.5 sm:px-4 py-2.5 text-[11px] sm:text-sm font-medium text-white shadow-2xl backdrop-blur-lg transition duration-300 hover:-translate-y-0.5 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            style={{ animation: 'fade-up-keyframe 0.5s ease-out' }}
          >
            <span className="text-lg">📢</span>
            <span>WPC 2026</span>
          </button>
        )}

        {/* Confession Popup */}
        {!showModal && showConfessionPopup && (
          <ConfessionPopup
            onClose={() => setShowConfessionPopup(false)}
            delay={1800}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
