// components/ui/Homepage/Herosection.tsx
'use client';

import React from 'react';
import PageHero from '../PageHero';

export type HeroSectionProps = {
  title: string;
  subtitle?: string;
  description?: string;
  chips?: string[];

  /** ✅ add this so LeadersPage can pass it */
  backgroundImage?: string;

  showButtons?: boolean;
  showScrollIndicator?: boolean;
};

export default function HeroSection({
  title,
  subtitle,
  description,
  chips,
  backgroundImage,
  showButtons,
  showScrollIndicator,
}: HeroSectionProps) {
  return (
    <PageHero
      title={title}
      subtitle={subtitle}
      note={description}
      chips={chips}
      /** ✅ forward it (PageHero must accept it or ignore it) */
      backgroundImage={backgroundImage}
      showButtons={showButtons}
      showScrollIndicator={showScrollIndicator}
    />
  );
}
