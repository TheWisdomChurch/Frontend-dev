// Lightweight shared hero shim to reuse new PageHero across subpages
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
