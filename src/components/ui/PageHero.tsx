// components/ui/PageHero.tsx
'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { WisdomeHouseLogo } from '../assets';
import { useTheme } from '../contexts/ThemeContext';
import { Caption, H2, BodySM } from '../text';
import { Section, Container } from '../layout';

type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  note?: string;
  chips?: string[];
};

export default function PageHero({
  title,
  subtitle,
  eyebrow = 'The Wisdom House Church',
  note,
  chips,
}: PageHeroProps) {
  const { colorScheme } = useTheme();

  const overlay = useMemo(
    () =>
      `radial-gradient(circle at 20% 20%, ${colorScheme.opacity.primary20} 0%, transparent 32%), radial-gradient(circle at 80% 10%, ${colorScheme.opacity.primary10} 0%, transparent 36%), radial-gradient(circle at 55% 90%, ${colorScheme.opacity.primary10} 0%, transparent 42%)`,
    [colorScheme.opacity.primary10, colorScheme.opacity.primary20]
  );

  return (
    <Section padding="none" className="relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 -z-10" style={{ background: overlay, filter: 'blur(70px)' }} />
      <div className="absolute inset-0 -z-20 flex items-center justify-center opacity-8 sm:opacity-10">
        <Image
          src={WisdomeHouseLogo}
          alt="Wisdom House watermark"
          width={520}
          height={520}
          className="object-contain grayscale"
          priority
        />
      </div>

      <Container
        size="xl"
        className="relative z-10 flex flex-col gap-6 sm:gap-7 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-20"
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 w-fit backdrop-blur fade-up">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/15 bg-black/60">
            <Image src={WisdomeHouseLogo} alt="The Wisdom House" fill className="object-contain p-1.5" />
          </div>
          <Caption className="text-white/80 uppercase tracking-[0.22em] text-[11px]">{eyebrow}</Caption>
        </div>

        <div className="space-y-3 max-w-3xl fade-up" style={{ animationDelay: '70ms' }}>
          <H2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-white leading-tight">
            {title}
          </H2>
          {subtitle && (
            <BodySM className="text-white/80 text-base sm:text-lg leading-relaxed">
              {subtitle}
            </BodySM>
          )}
          {note && (
            <BodySM className="text-white/65 text-sm sm:text-base leading-relaxed">
              {note}
            </BodySM>
          )}
        </div>

        {chips?.length ? (
          <div className="flex flex-wrap gap-2 fade-up" style={{ animationDelay: '120ms' }}>
            {chips.map(chip => (
              <span
                key={chip}
                className="px-3 py-1 rounded-full text-xs font-semibold border border-white/15 bg-white/5 text-white"
                style={{ boxShadow: `0 8px 20px ${colorScheme.opacity.primary10}` }}
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
