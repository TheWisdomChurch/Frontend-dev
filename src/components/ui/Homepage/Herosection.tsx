// Lightweight wrapper to reuse PageHero for legacy imports
'use client';

import PageHero from '../PageHero';

type HeroSectionProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  chips?: string[];
};

export default function HeroSection({
  title = '',
  subtitle,
  description,
  chips,
}: HeroSectionProps) {
  return (
    <PageHero
      title={title}
      subtitle={subtitle}
      note={description}
      chips={chips}
    />
  );
}
