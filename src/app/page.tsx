'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import WhatWeDo from '@/components/ui/Homepage/WhatWeDo';
import SeniorPastor from '@/components/ui/Homepage/SeniorPastor';
import AssociatePastors from '@/components/ui/Homepage/AssociatePastors';
import JoinLighthouse from '@/components/ui/Homepage/JoinUs';
import OnlineGiving from '@/components/ui/Homepage/OnlineGiving';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="flex-1">
        {/* HeroSection will start right after header */}
        <HeroSection />

        {/* Remove container wrappers and let components handle their own width */}
        <WhatWeDo />
        <SeniorPastor />
        <AssociatePastors />
        <JoinLighthouse />
        <OnlineGiving />
      </main>
    </div>
  );
}
