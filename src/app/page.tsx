// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/ui/Homepage/Herosection';
import WhatWeDo from '@/components/ui/Homepage/WhatWeDo';
import SeniorPastor from '@/components/ui/Homepage/SeniorPastor';
import AssociatePastors from '@/components/ui/Homepage/AssociatePastors';
import JoinWisdomHouse from '@/components/ui/Homepage/JoinUs';
import OnlineGiving from '@/components/ui/Homepage/OnlineGiving';
// import JoinIndex from '@/components/ui/Homepage/JoinUsIndex';
import ProfessionalPopup from '@/components/ui/ConfessionPopup';
import MobileDebug from '@/components/utils/mobileDebug';
import { slides } from '@/lib/data';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
    if (fontsLoaded) {
      const hasSeenPopup = localStorage.getItem('hasSeenPopup');
      const lastSeenDate = localStorage.getItem('popupLastSeen');
      const today = new Date().toDateString();

      if (!hasSeenPopup || lastSeenDate !== today) {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [fontsLoaded]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <main className="flex-1 w-full">
        {process.env.NODE_ENV === 'development' && <MobileDebug />}

        {/* Force remove ALL spacing between components */}
        <div className="[&>*]:m-0 [&>*]:p-0 [&>*]:border-0">
          <HeroSection
            slides={slides}
            showButtons={true}
            showScrollIndicator={true}
            showSlideIndicators={true}
          />
          <WhatWeDo />
          <SeniorPastor />

          <AssociatePastors />
          {/* <JoinIndex /> */}
          <JoinWisdomHouse />
          <OnlineGiving />
        </div>

        {showModal && (
          <ProfessionalPopup onClose={handleCloseModal} delay={0} />
        )}
      </main>
    </div>
  );
}
