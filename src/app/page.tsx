'use client';

import React, { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { useTheme } from '@/shared/contexts/ThemeContext';
import HeroHighlights from '@/features/hero/HeroHighlights';
import EventsShowcase from '@/features/events/EventsShowcase';
import JoinUs from '@/features/events/JoinUs';
import ResourceSection from '@/features/resources/Resource';
import { apiClient } from '@/lib/api';

// Optimize: Allow caching where possible, only force dynamic for truly dynamic sections
// Note: Since this component uses useState and useEffect, we can't use revalidate here
// Use force-dynamic: false to allow ISR where possible with dynamic segments

// ============================================================================
// DYNAMIC IMPORTS - Using reorganized feature components
// Optimize: Enable SSR where possible for better initial load performance
// ============================================================================

// Fast-loading components - SSR enabled with proper fallbacks
const HeroMain = nextDynamic(() => import('@/features/hero/HeroMain'), {
  ssr: true, // Enable SSR for above-fold content
  loading: () => <div className="h-[500px] bg-slate-900 animate-pulse" />,
});

// Mid-load components - SSR enabled
const WhatWeDo = nextDynamic(() => import('@/features/WhatWeDo'), {
  ssr: true,
  loading: () => <div className="h-[400px] bg-slate-900 animate-pulse" />,
});

const SeniorPastor = nextDynamic(
  () => import('@/features/leadership/SeniorPastor'),
  {
    ssr: true,
    loading: () => <div className="h-[350px] bg-slate-900 animate-pulse" />,
  }
);

const Testimonials = nextDynamic(
  () => import('@/features/testimonials/Testimonials'),
  {
    ssr: true,
    loading: () => <div className="h-[400px] bg-slate-900 animate-pulse" />,
  }
);

const OnlineGiving = nextDynamic(
  () => import('@/features/events/OnlineGiving'),
  {
    ssr: true,
    loading: () => <div className="h-[350px] bg-slate-900 animate-pulse" />,
  }
);

// Modal components - Client-side only
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

// ============================================================================
// HOMEPAGE COMPONENT
// ============================================================================

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
  image: '/HEADER.png',
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

  const autoOpenDelayMs = 1200;
  const closeCooldownMs = 1000 * 60 * 20;
  const remindCooldownMs = 1000 * 60 * 45;

  // Backend-driven homepage content (ad + confession copy)
  useEffect(() => {
    let mounted = true;

    const loadHomepageContent = async () => {
      try {
        const [adPayload, confessionPayload] = await Promise.all([
          apiClient.getHomepageAd(),
          apiClient.getConfessionContent(),
        ]);

        if (!mounted) return;

        if (adPayload) {
          setEventAd(prev => ({
            ...prev,
            ...(adPayload as Partial<HomeEventAd>),
          }));
        }

        if (confessionPayload) {
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
      } catch {
        // Keep fallback content when backend payload is unavailable.
      }
    };

    loadHomepageContent();
    return () => {
      mounted = false;
    };
  }, []);

  // Initialize modal timing on mount
  useEffect(() => {
    document.body.classList.add('home-page');
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  // Initialize modal timing on mount (runtime only; no local storage)
  useEffect(() => {
    setNextAdAt(Date.now() + autoOpenDelayMs);
  }, [autoOpenDelayMs]);

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
          <div id="give" data-gsap="reveal">
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
            content={confessionContent ?? undefined}
          />
        )}
      </main>
    </div>
  );
}
