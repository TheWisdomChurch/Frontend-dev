// components/ui/Homepage/Herosection.tsx
'use client';

import React from 'react';
import PageHero from '../PageHero';

export type HeroSectionProps = {
  title: string;
  subtitle?: string;
  description?: string;
  chips?: string[];

  backgroundImage?: string;

  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showScrollIndicator?: boolean;
};

export default function HeroSection({
  title,
  subtitle,
  description,
  chips,
  backgroundImage,
  showButtons,
  primaryButtonText,
  secondaryButtonText,
  showScrollIndicator,
}: HeroSectionProps) {
  return (
    <PageHero
      title={title}
      subtitle={subtitle}
      note={description}
      chips={chips}
      backgroundImage={backgroundImage}
      showButtons={showButtons}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      showScrollIndicator={showScrollIndicator}
    />
  );
}
