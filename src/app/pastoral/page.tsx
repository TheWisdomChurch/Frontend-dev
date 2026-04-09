// app/pastoral-care/page.tsx
'use client';

import PageHero from '@/features/hero/PageHero';
import PastoralCareUnit from '@/shared/ui/eventsForm/PastoralCare';

const PastoralCarePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Pastoral Care"
        subtitle="Walking with you through every season."
        note="Our pastoral team supports you in weddings, dedications, celebrations, and memorial services."
        chips={['Counsel', 'Weddings', 'Dedications', 'Memorials']}
      />

      {/* Pastoral Care Unit Component */}
      <PastoralCareUnit />
    </div>
  );
};

export default PastoralCarePage;
