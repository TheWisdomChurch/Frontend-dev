'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/ui/Homepage/Herosection';
import WhatWeDo from '@/components/ui/Homepage/WhatWeDo';
import SeniorPastor from '@/components/ui/Homepage/SeniorPastor';
import AssociatePastors from '@/components/ui/Homepage/AssociatePastors';
import JoinLighthouse from '@/components/ui/Homepage/JoinUs';
import OnlineGiving from '@/components/ui/Homepage/OnlineGiving';
import ProfessionalPopup from '@/components/ui/ConfessionPopup';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Check if fonts are loaded
    const checkFonts = () => {
      if (document.fonts && typeof document.fonts.check === 'function') {
        // Use the Font Loading API to check if fonts are ready
        document.fonts.ready.then(() => {
          setFontsLoaded(true);
        });
      } else {
        // Fallback for browsers that don't support Font Loading API
        setTimeout(() => setFontsLoaded(true), 1000);
      }
    };

    checkFonts();
  }, []);

  useEffect(() => {
    // Only show modal after fonts are loaded and check if user has seen it today
    if (fontsLoaded) {
      const hasSeenPopup = localStorage.getItem('hasSeenPopup');
      const lastSeenDate = localStorage.getItem('popupLastSeen');
      const today = new Date().toDateString();

      // Show modal only if never seen before or last seen was not today
      if (!hasSeenPopup || lastSeenDate !== today) {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 1500); // 1.5 second delay after fonts load

        return () => clearTimeout(timer);
      }
    }
  }, [fontsLoaded]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <WhatWeDo />
        <SeniorPastor />
        <AssociatePastors />
        <JoinLighthouse />
        <OnlineGiving />

        {/* Professional Popup Modal - Only shows once per day */}
        {showModal && (
          <ProfessionalPopup onClose={handleCloseModal} delay={0} />
        )}
      </main>
    </div>
  );
}
