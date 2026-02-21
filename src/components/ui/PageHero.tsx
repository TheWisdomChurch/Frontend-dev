// components/ui/PageHero.tsx
'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { WisdomeHouseLogo } from '../assets';
import { useTheme } from '../contexts/ThemeContext';
import { Caption, H2, BodySM } from '../text';
import { Section, Container } from '../layout';

export type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  note?: string;
  chips?: string[];
  compact?: boolean;

  backgroundImage?: string;

  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showScrollIndicator?: boolean;
};

export default function PageHero({
  title,
  subtitle,
  eyebrow = 'The Wisdom House Church',
  note,
  chips,
  compact = false,
  backgroundImage,
  showButtons,
  primaryButtonText,
  secondaryButtonText,
  showScrollIndicator,
}: PageHeroProps) {
  const { colorScheme } = useTheme();

  const overlay = useMemo(
    () =>
      `radial-gradient(circle at 20% 20%, ${colorScheme.opacity.primary20} 0%, transparent 32%),
       radial-gradient(circle at 80% 10%, ${colorScheme.opacity.primary10} 0%, transparent 36%),
       radial-gradient(circle at 55% 90%, ${colorScheme.opacity.primary10} 0%, transparent 42%)`,
    [colorScheme.opacity.primary10, colorScheme.opacity.primary20]
  );

  return (
    <Section
      padding="none"
      className="relative overflow-hidden bg-[#050505] min-h-[58vh] sm:min-h-[62vh] lg:min-h-[68vh] flex items-center"
    >
      {/* Optional background image */}
      {backgroundImage ? (
        <div className="absolute inset-0 -z-30">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover object-center sm:object-[center_20%]"
            sizes="100vw"
          />
          {/* darken for legibility */}
          <div className="absolute inset-0 bg-black/65 sm:bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70 sm:from-black/55 sm:via-black/35 sm:to-black/55" />
        </div>
      ) : null}

      {/* Glow overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-50 sm:opacity-70"
        style={{ background: overlay, filter: 'blur(60px)' }}
      />

      {/* Watermark */}
      <div className="absolute inset-0 -z-20 hidden sm:flex items-center justify-center opacity-10">
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
        className="relative z-10 flex flex-col gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20"
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 w-fit backdrop-blur fade-up">
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-lg overflow-hidden border border-white/15 bg-black/60">
            <Image
              src={WisdomeHouseLogo}
              alt="The Wisdom House"
              fill
              className="object-contain p-1.5"
            />
          </div>
          <Caption className="text-white/80 uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">
            {eyebrow}
          </Caption>
        </div>

        <div
          className="space-y-2 max-w-3xl fade-up text-center sm:text-left"
          style={{ animationDelay: '70ms' }}
        >
          <H2
            className={
              compact
                ? 'text-2xl sm:text-3xl md:text-[2.1rem] font-semibold text-white leading-tight text-balance'
                : 'text-2xl sm:text-3xl md:text-[2.4rem] font-semibold text-white leading-tight text-balance'
            }
          >
            {title}
          </H2>

          {subtitle ? (
            <BodySM
              className={
                compact
                  ? 'text-white/80 text-sm sm:text-base leading-relaxed text-balance'
                  : 'text-white/80 text-sm sm:text-base leading-relaxed text-balance'
              }
            >
              {subtitle}
            </BodySM>
          ) : null}

          {note ? (
            <BodySM
              className={
                compact
                  ? 'text-white/65 text-xs sm:text-sm leading-relaxed text-balance'
                  : 'text-white/65 text-xs sm:text-sm leading-relaxed text-balance'
              }
            >
              {note}
            </BodySM>
          ) : null}
        </div>

        {chips?.length ? (
          <div
            className="flex flex-wrap gap-2 fade-up justify-center sm:justify-start"
            style={{ animationDelay: '120ms' }}
          >
            {chips.map(chip => (
              <span
                key={chip}
                className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium border border-white/15 bg-white/5 text-white"
                style={{
                  boxShadow: `0 8px 20px ${colorScheme.opacity.primary10}`,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        {/* Reserved props to keep hero API stable across pages. */}
        {showButtons ||
        primaryButtonText ||
        secondaryButtonText ||
        showScrollIndicator
          ? null
          : null}
      </Container>
    </Section>
  );
}
