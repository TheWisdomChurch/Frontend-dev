'use-client';

import HeroSection from '../../components/ui/mainPage/Herosection';
import Navigation from '../../components/ui/navigation/Navigation';
import WhatWeDo from '../../components/ui/mainPage/WhatWeDo';
import SeniorPastor from '../../components/ui/mainPage/SeniorPastor';
import AssociatePastors from '../../components/ui/mainPage/AssociatePastors';
import JoinLighthouse from '../../components/ui/mainPage/JoinUs';
import OnlineGiving from '../../components/ui/mainPage/OnlineGiving';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <WhatWeDo />
      <SeniorPastor />
      <AssociatePastors />
      <JoinLighthouse />
      <OnlineGiving />
    </div>
  );
}
