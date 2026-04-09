// components/ui/PageHero.tsx
'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { WisdomeHouseLogo } from '@/shared/assets';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { Caption, H2, BodySM } from '@/shared/text';
import { Section, Container } from '@/shared/layout';
import { cn } from '@/lib/cn';

export type PageHeroProps = {
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  note?: string;
  chips?: string[];
  compact?: boolean;
  variant?: 'default' | 'about';

  backgroundImage?: string;

  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showScrollIndicator?: boolean;
};

export default function PageHero({
  title,
  subtitle,
  description,
  eyebrow = 'The Wisdom House Church',
  note,
  chips,
  compact = false,
  variant = 'default',
  backgroundImage,
  showButtons,
  primaryButtonText,
  secondaryButtonText,
  showScrollIndicator,
}: PageHeroProps) {
  const { colorScheme } = useTheme();
  const isAboutVariant = variant === 'about';
  const supportingCopy = note ?? description;
  const visualChips =
    chips && chips.length
      ? chips.slice(0, 4)
      : ['Word & Power', 'Excellence', 'Generations', 'Nations'];

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
      className={cn(
        'relative overflow-hidden bg-[#050505] flex items-center',
        isAboutVariant
          ? 'min-h-[70vh] sm:min-h-[76vh] lg:min-h-[80vh]'
          : 'min-h-[64vh] sm:min-h-[70vh] lg:min-h-[74vh]'
      )}
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
          <div className="absolute inset-0 bg-black/65 sm:bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/90" />
        </div>
      ) : null}

      {/* Linear gradient wash */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(135deg, rgba(6,6,6,0.92) 0%, rgba(15,17,22,0.82) 40%, rgba(6,6,6,0.96) 100%)',
        }}
      />

      {/* Glow overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-60 sm:opacity-75"
        style={{ background: overlay, filter: 'blur(60px)' }}
      />

      <Container
        size="xl"
        className={cn(
          'relative z-10 px-4 sm:px-6 md:px-8 lg:px-10 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24'
        )}
      >
        <div
          className={cn(
            'grid gap-10 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end'
          )}
        >
          <div
            className={cn('space-y-6 sm:space-y-7 text-center lg:text-left')}
          >
            <div className="flex justify-center lg:justify-start fade-up">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 w-fit backdrop-blur">
                <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-md overflow-hidden border border-white/15 bg-black/60">
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
            </div>

            <div className={cn('space-y-3 max-w-3xl mx-auto lg:mx-0 fade-up')}>
              <H2
                className={
                  compact
                    ? 'text-[1.9rem] sm:text-3xl md:text-[2.2rem] font-semibold text-white leading-tight text-balance'
                    : isAboutVariant
                      ? 'text-[2.1rem] sm:text-3xl md:text-[2.7rem] lg:text-[3rem] font-semibold text-white leading-[1.08] text-balance'
                      : 'text-[2rem] sm:text-3xl md:text-[2.5rem] font-semibold text-white leading-tight text-balance'
                }
              >
                {title}
              </H2>

              {subtitle ? (
                <BodySM className="text-white/80 text-sm sm:text-base leading-relaxed text-balance">
                  {subtitle}
                </BodySM>
              ) : null}

              {supportingCopy ? (
                <BodySM className="text-white/65 text-xs sm:text-sm leading-relaxed text-balance max-w-2xl">
                  {supportingCopy}
                </BodySM>
              ) : null}
            </div>

            {chips?.length ? (
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start fade-up">
                {chips.map(chip => (
                  <span
                    key={chip}
                    className="rounded-full font-medium border border-white/15 bg-white/5 text-white px-3 py-1.5 text-[10px] sm:text-[11px]"
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
          </div>

          <div className="relative fade-up">
            <div
              className="relative rounded-2xl border border-white/12 bg-black/60 backdrop-blur-xl p-6 sm:p-7"
              style={{
                boxShadow: `0 24px 60px ${colorScheme.opacity.black50}`,
              }}
            >
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(circle at 85% 20%, ${colorScheme.opacity.primary20} 0%, transparent 42%)`,
                }}
              />

              <div className="relative space-y-4">
                <Caption
                  className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px]"
                  style={{ color: colorScheme.primary }}
                >
                  {eyebrow}
                </Caption>

                <div className="grid grid-cols-[auto_1fr] items-center gap-3 sm:gap-4">
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden border border-white/15 bg-black/70">
                    <Image
                      src={WisdomeHouseLogo}
                      alt="The Wisdom House logo"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-sm sm:text-base leading-tight">
                      {subtitle || title}
                    </p>
                    {note ? (
                      <p className="text-white/65 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {note}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {visualChips.map(chip => (
                    <div
                      key={chip}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5"
                    >
                      <p className="text-white text-xs sm:text-sm font-medium leading-tight">
                        {chip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
