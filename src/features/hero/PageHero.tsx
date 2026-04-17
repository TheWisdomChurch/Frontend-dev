// components/ui/PageHero.tsx
'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { WisdomeHouseLogo } from '@/shared/assets';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { Caption, H2, BodySM } from '@/shared/text';
import { Section, Container } from '@/shared/layout';

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
  eyebrow = '',
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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const titleBlockRef = useRef<HTMLDivElement | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (!rootRef.current) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 }
        );
      }
      if (titleBlockRef.current) {
        tl.fromTo(
          titleBlockRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.2'
        );
      }
      if (chipsRef.current) {
        tl.fromTo(
          chipsRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.25'
        );
      }
      if (panelRef.current) {
        tl.fromTo(
          panelRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          '-=0.3'
        );
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.85,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      padding="none"
      className={`relative overflow-hidden bg-[#050505] flex items-center ${
        isAboutVariant
          ? 'min-h-[44vh] sm:min-h-[48vh] lg:min-h-[52vh]'
          : 'min-h-[36vh] sm:min-h-[40vh] lg:min-h-[44vh]'
      }`}
    >
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70 sm:from-black/55 sm:via-black/35 sm:to-black/55" />
        </div>
      ) : null}

      <div
        className="absolute inset-0 -z-10 opacity-50 sm:opacity-70"
        style={{ background: overlay, filter: 'blur(60px)' }}
        ref={glowRef}
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-black via-black/85 to-transparent sm:h-32" />

      {isAboutVariant ? (
        <div
          className="absolute inset-0 z-[-15] opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            maskImage:
              'radial-gradient(circle at 50% 40%, black 35%, transparent 85%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 40%, black 35%, transparent 85%)',
          }}
        />
      ) : null}

      <div
        className={`absolute inset-0 -z-20 hidden sm:flex items-center justify-center ${
          isAboutVariant ? 'opacity-[0.06]' : 'opacity-10'
        }`}
      >
        <Image
          src={WisdomeHouseLogo}
          alt="Wisdom House watermark"
          width={520}
          height={520}
          className="object-contain grayscale"
          priority
        />
      </div>

      <Container size="xl">
        <div
          ref={rootRef}
          className={`relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 pt-12 sm:pt-14 lg:pt-16 pb-10 sm:pb-12 lg:pb-14 ${
            isAboutVariant
              ? 'grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-center gap-6 sm:gap-8 lg:gap-10'
              : 'flex flex-col gap-4 sm:gap-5 lg:gap-6'
          }`}
        >
          <div
            className={`space-y-4 sm:space-y-5 ${
              isAboutVariant ? 'max-w-3xl' : ''
            }`}
          >
            {eyebrow ? (
              <div
                ref={eyebrowRef}
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 w-fit backdrop-blur"
              >
                <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-white/15 bg-black/60">
                  <Image
                    src={WisdomeHouseLogo}
                    alt="The Wisdom House"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <Caption className="text-white/80 uppercase tracking-[0.22em] text-[9px] sm:text-[10px]">
                  {eyebrow}
                </Caption>
              </div>
            ) : null}

            <div
              ref={titleBlockRef}
              className={`space-y-2 max-w-3xl ${
                isAboutVariant ? 'text-left' : 'text-center sm:text-left'
              }`}
            >
              <H2
                className={
                  compact
                    ? 'text-2xl sm:text-3xl md:text-[2.1rem] font-medium text-white leading-tight text-balance'
                    : isAboutVariant
                      ? 'text-[1.85rem] sm:text-3xl md:text-[2.35rem] lg:text-[2.5rem] font-medium text-white leading-[1.1] text-balance'
                      : 'text-2xl sm:text-3xl md:text-[2.2rem] font-medium text-white leading-tight text-balance'
                }
              >
                {title}
              </H2>

              <div
                className={`h-px w-12 sm:w-16 ${
                  isAboutVariant ? '' : 'mx-auto sm:mx-0'
                }`}
                style={{
                  background: `linear-gradient(90deg, transparent, ${colorScheme.primary}, transparent)`,
                  boxShadow: `0 0 12px ${colorScheme.opacity.primary30}`,
                }}
              />

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
              <div
                ref={chipsRef}
                className={`${
                  isAboutVariant
                    ? 'grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5'
                    : 'flex flex-wrap gap-2 justify-center sm:justify-start'
                }`}
              >
                {chips.map(chip => (
                  <span
                    key={chip}
                    className={`rounded-full font-medium border border-white/15 bg-white/5 text-white ${
                      isAboutVariant
                        ? 'px-3 py-2 text-[10px] sm:px-2.5 sm:py-1 sm:text-[10px] text-center'
                        : 'px-2.5 py-1 text-[9.5px] sm:text-[10px]'
                    }`}
                    style={{
                      boxShadow: `0 8px 20px ${colorScheme.opacity.primary10}`,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}

            {showButtons ||
            primaryButtonText ||
            secondaryButtonText ||
            showScrollIndicator
              ? null
              : null}
          </div>

          {isAboutVariant ? (
            <div ref={panelRef} className="relative">
              <div
                className="relative rounded-3xl border border-white/10 p-3 sm:p-4 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(155deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.16) 100%)',
                  boxShadow: `0 24px 60px ${colorScheme.opacity.black50}`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: `radial-gradient(circle at 88% 18%, ${colorScheme.opacity.primary20} 0%, transparent 42%)`,
                  }}
                />

                <div className="relative rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Caption
                      className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px]"
                      style={{ color: colorScheme.primary }}
                    >
                      {eyebrow}
                    </Caption>
                  </div>

                  <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-3 sm:gap-4">
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border border-white/15 bg-black/70">
                      <Image
                        src={WisdomeHouseLogo}
                        alt="The Wisdom House logo"
                        fill
                        className="object-contain p-2 sm:p-2.5"
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

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {visualChips.map(chip => (
                      <div
                        key={chip}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                      >
                        <p className="text-white text-xs sm:text-sm font-medium leading-tight">
                          {chip}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 relative h-14 sm:h-16 rounded-xl overflow-hidden border border-white/10 bg-black/35">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(120deg, transparent 0%, ${colorScheme.opacity.primary20} 35%, transparent 70%)`,
                      }}
                    />
                    <div
                      className="absolute -left-6 top-1/2 h-[2px] w-24 sm:w-28 -translate-y-1/2 rotate-[22deg]"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    <div
                      className="absolute -right-5 top-1/2 h-[2px] w-20 sm:w-24 -translate-y-1/2 -rotate-[18deg]"
                      style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-4">
                      <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-white/70">
                        {visualChips[0] || 'Wisdom'}
                      </span>
                      <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-white/70">
                        {visualChips[1] || 'Power'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
