// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/ui/Homepage/heromain';
import HeroHighlights from '@/components/ui/Homepage/HeroHighlights';
import ProfessionalPopup from '@/components/ui/ConfessionPopup';
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

    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1400);

    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  const handleCloseModal = () => {
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
      />
      <main className="flex-1 w-full">
        {process.env.NODE_ENV === 'development' && <MobileDebug />}

        <div className="flex flex-col">
          <HeroSection />
          <HeroHighlights />
          <WhatWeDo />
          <EventsShowcase />
          <SeniorPastor />
          <AssociatePastors />
          <div id="join">
            <JoinWisdomHouse />
          </div>
          <Testimonial />
          <OnlineGiving />
          <ResourceSection />
        </div>

        {showModal && (
          <ProfessionalPopup onClose={handleCloseModal} delay={0} />
        )}
      </main>
    </div>
  );
}
