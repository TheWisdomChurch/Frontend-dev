// app/pastoral-care/page.tsx
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { hero_bg_2 } from '@/components/assets';
import PastoralCareUnit from '@/components/ui/eventsForm/PastoralCare';

const PastoralCarePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Pastoral Care Unit"
        subtitle="Celebrating Life's Milestones Together"
        description="Let us be part of your special moments. Our pastoral care team is here to support you in weddings, dedications, celebrations, and memorial services."
        backgroundImage={hero_bg_2.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Pastoral Care Unit Component */}
      <PastoralCareUnit />
    </div>
  );
};

export default PastoralCarePage;
