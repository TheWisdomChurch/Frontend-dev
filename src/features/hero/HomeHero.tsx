'use client';

import { useCallback, useRef } from 'react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { Play } from 'lucide-react';

import { cn } from '@/lib/cn';
import { lader } from '@/shared/assets';
import { IMAGE_QUALITY } from '@/shared/constants';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { Container } from '@/shared/ui/Container';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';

export interface HomeHeroProps {
  backgroundImage?: string | StaticImageData;
  imagePositionClassName?: string;
  priority?: boolean;
}

export default function HomeHero({
  backgroundImage = lader,
  imagePositionClassName,
  priority = true,
}: HomeHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const watchLiveBtnRef = useRef<HTMLAnchorElement>(null);
  const planVisitBtnRef = useRef<HTMLDivElement>(null);

  // Smooth mouse-directional tracking for hero 3D camera parallax
  const handleHeroMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      hero.style.setProperty('--hero-mouse-x', normX.toFixed(3));
      hero.style.setProperty('--hero-mouse-y', normY.toFixed(3));
    },
    []
  );

  const handleHeroMouseLeave = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;
    hero.style.setProperty('--hero-mouse-x', '0');
    hero.style.setProperty('--hero-mouse-y', '0');
  }, []);

  // Directional mouse coordinate tracker for interactive button spotlights
  const updateButtonSpotlight = (
    e: React.MouseEvent<HTMLElement>,
    ref: React.RefObject<HTMLElement | null>
  ) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section
      ref={heroRef}
      data-site-hero
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="tone-dark relative isolate flex h-screen min-h-[100svh] w-full max-w-full flex-col justify-end overflow-hidden overflow-x-clip bg-[var(--app-dark)] text-white"
    >
      {/* ── 1. Living Video Background Canvas (Ken Burns Drift, Light Beams, & Stage Flare) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      >
        <div className="hero-cinematic-zoom-layer will-change-transform">
          <div
            data-hero-media
            className="hero-parallax-canvas relative h-full w-full will-change-transform"
          >
            <Image
              src={backgroundImage}
              alt="The Wisdom Church worship service"
              fill
              priority={priority}
              quality={IMAGE_QUALITY}
              sizes="100vw"
              className={cn(
                'h-full w-full max-w-full object-cover',
                imagePositionClassName || 'object-[center_14%]'
              )}
            />

            {/* Atmospheric Sanctuary Stage Lighting Sweep */}
            <div className="hero-video-light-beam" />
            {/* Volumetric Stage Glow Pulse */}
            <div className="hero-stage-flare" />
            {/* Filmic Ambient Dust Particles */}
            <div className="hero-filmic-dust" />
          </div>
        </div>
      </div>

      {/* ── 2. Cinematic HD Vignette & Deep Contrast Gradients ───────────────── */}
      {/* Top wash for clear header navbar legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-black/90 via-black/50 to-transparent"
      />

      {/* Deep radial contrast vignette for ultra-rich HD focus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,transparent_35%,color-mix(in_srgb,var(--app-dark)_60%,transparent)_75%,var(--app-dark)_100%)]"
      />

      {/* Base high-definition gradient ensuring 100% text readability */}
      <div
        data-hero-overlay
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--app-dark)_0%,color-mix(in_srgb,var(--app-dark)_90%,transparent)_32%,color-mix(in_srgb,var(--app-dark)_45%,transparent)_62%,transparent_85%)]"
      />

      {/* Subtle warm gold ambient aura */}
      <div aria-hidden="true" className="hero-aurora" />

      {/* ── 3. Hero Content: Full-Bleed Clean Layout (DCC Style) ──────────────── */}
      <Container className="relative z-10 w-full pb-10 sm:pb-14 lg:pb-18">
        <div
          data-hero-content
          className="hero-parallax-content flex w-full max-w-4xl flex-col items-start gap-4 sm:gap-5"
        >
          {/* Eyebrow: Minimalist Editorial Tag (No Icons) */}
          <div data-hero-item className="inline-flex max-w-full items-center">
            <span className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-[var(--app-primary-light)]">
              The Wisdom Church · A Spirit-Filled Wave of Greatness
            </span>
          </div>

          {/* Headline: Clean, Punchy, High Definition (Immediately visible on load) */}
          <h1 className="w-full max-w-4xl font-ui leading-[1.12] tracking-[-0.03em] text-white [text-shadow:0_4px_36px_black]">
            <span className="block text-[clamp(2.3rem,1.5rem+4vw,4.4rem)] font-bold tracking-[-0.03em] text-white">
              Empowering Believers
            </span>
            <span className="hero-accent block font-headline text-[clamp(2.2rem,1.4rem+3.8vw,4.2rem)] font-normal italic tracking-[-0.02em] text-[var(--app-primary-light)]">
              for a life of impact and greatness.
            </span>
          </h1>

          {/* Directional Interactive Action Buttons */}
          <div
            data-hero-item
            className="flex flex-row flex-wrap items-center gap-3.5 pt-2 sm:gap-4 sm:pt-3"
          >
            {/* Primary Live Button (DCC Style Solid Pill with Hover Direction) */}
            <a
              ref={watchLiveBtnRef}
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noreferrer"
              onMouseMove={e => updateButtonSpotlight(e, watchLiveBtnRef)}
              className="hero-directional-btn group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[var(--app-primary-dark)] via-[var(--app-primary)] to-[var(--app-primary-light)] px-7 py-3 font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-dark)] shadow-[0_4px_20px_color-mix(in_srgb,var(--app-primary)_40%,transparent)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--app-primary)_70%,transparent)]"
            >
              <span className="hero-btn-spotlight" />
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Watch Live</span>
            </a>

            {/* Secondary Outline Button (DCC Style Crisp Glass Border with Arrow) */}
            <div
              ref={planVisitBtnRef}
              onMouseMove={e => updateButtonSpotlight(e, planVisitBtnRef)}
              className="hero-directional-btn hero-plan-btn inline-flex rounded-full"
            >
              <PlanVisitTrigger
                plain
                icon={false}
                className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-white/70 bg-white/10 px-7 py-3 font-ui text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/25 hover:scale-[1.02]"
              >
                <span className="hero-btn-spotlight" />
                <span>Plan your visit</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </PlanVisitTrigger>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
