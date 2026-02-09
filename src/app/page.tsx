// app/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/ui/Homepage/heromain';
import HeroHighlights from '@/components/ui/Homepage/HeroHighlights';
import EventAdModal from '@/components/ui/Homepage/EventAdModal';
import MobileDebug from '@/components/utils/mobileDebug';
import { useTheme } from '@/components/contexts/ThemeContext';

const WhatWeDo = dynamic(() => import('@/components/ui/Homepage/WhatWeDo'), {
  ssr: true,
  loading: () => <div className="min-h-[220px]" />,
});
const EventsShowcase = dynamic(
  () => import('@/components/ui/Homepage/EventsShowcase'),
  { ssr: true, loading: () => <div className="min-h-[240px]" /> }
);
const SeniorPastor = dynamic(() => import('@/components/ui/Homepage/SeniorPastor'), {
  ssr: true,
  loading: () => <div className="min-h-[260px]" />,
});
const AssociatePastors = dynamic(
  () => import('@/components/ui/Homepage/AssociatePastors'),
  { ssr: true, loading: () => <div className="min-h-[220px]" /> }
);
const JoinWisdomHouse = dynamic(() => import('@/components/ui/Homepage/JoinUs'), {
  ssr: true,
  loading: () => <div className="min-h-[240px]" />,
});
const Testimonial = dynamic(() => import('@/components/ui/Homepage/Testimonials'), {
  ssr: true,
  loading: () => <div className="min-h-[200px]" />,
});
const OnlineGiving = dynamic(() => import('@/components/ui/Homepage/OnlineGiving'), {
  ssr: true,
  loading: () => <div className="min-h-[200px]" />,
});
const ResourceSection = dynamic(() => import('@/components/ui/Homepage/Resource'), {
  ssr: true,
  loading: () => <div className="min-h-[200px]" />,
});

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { colorScheme } = useTheme();

  const eventAd = useMemo(
    () => ({
      id: 'rise-2026',
      title: 'Rise Conference 2026',
      subtitle: 'A 2-day encounter for leaders, creatives, and visionaries.',
      description:
        'Join powerful sessions on leadership, worship, and breakthrough. Seats are limited — reserve now and get priority access to the conference guide.',
      startAt: '2026-03-14T09:00:00Z',
      location: 'Wisdom House Auditorium, Lagos',
      imageUrl: '/HEADER.png',
      formSlug: null,
      ctaLabel: 'Register in 30 seconds',
    }),
    []
  );

  useEffect(() => {
    const checkFonts = () => {
      if (document.fonts && typeof document.fonts.check === 'function') {
        document.fonts.ready.then(() => {
          setFontsLoaded(true);
        });
      } else {
        setTimeout(() => setFontsLoaded(true), 1000);
      }
    };

    checkFonts();
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;

    const storageKey = 'wc_event_ad_seen_v1';
    const now = Date.now();
    const nextAllowedRaw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    const nextAllowed = nextAllowedRaw ? Number(nextAllowedRaw) : 0;

    if (nextAllowed && now < nextAllowed) return;

    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1400);

    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  const handleCloseModal = () => {
    const storageKey = 'wc_event_ad_seen_v1';
    const cooldownMs = 1000 * 60 * 60 * 12;
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(Date.now() + cooldownMs));
    }
    setShowModal(false);
  };

  const handleRemindLater = () => {
    const storageKey = 'wc_event_ad_seen_v1';
    const cooldownMs = 1000 * 60 * 60; // 1 hour
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(Date.now() + cooldownMs));
    }
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
          <div data-gsap="reveal">
            <AssociatePastors />
          </div>
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
      </main>
    </div>
  );
}
