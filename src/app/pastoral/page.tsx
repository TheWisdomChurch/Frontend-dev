// app/pastoral-care/page.tsx
'use client';

import PageHero from '@/components/ui/PageHero';
import PastoralCareUnit from '@/components/ui/eventsForm/PastoralCare';

const PastoralCarePage = () => {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Pastoral Care"
        subtitle="Celebrating life’s milestones together"
        note="Our pastoral team is here to support you in weddings, dedications, celebrations, and memorial services."
        chips={['Counsel', 'Weddings', 'Dedications', 'Memorials']}
      />

      {/* Pastoral Care Unit Component */}
      <PastoralCareUnit />
    </div>
  );
};

export default PastoralCarePage;
