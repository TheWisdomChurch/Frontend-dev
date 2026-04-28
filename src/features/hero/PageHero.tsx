'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';

import { WisdomeHouseLogo } from '@/shared/assets';
import { Container, Section } from '@/shared/layout';

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
  eyebrow = 'The Wisdom Church',
  note,
  chips,
  compact = false,
  variant = 'default',
  backgroundImage,
  showButtons = false,
  primaryButtonText = 'Plan your visit',
  secondaryButtonText = 'Learn more',
  showScrollIndicator = false,
}: PageHeroProps) {
  const supportingCopy = note ?? description;
  const isAboutVariant = variant === 'about';

  return (
    <Section
      padding="none"
      className="relative isolate overflow-hidden bg-[#050505] text-white"
    >
      {backgroundImage ? (
        <div className="absolute inset-0 -z-30">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      ) : null}

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_15%,rgba(247,222,18,0.16),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#050505_0%,#080808_48%,#050505_100%)]" />

      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#f7de12]/50 to-transparent" />

      <div className="absolute left-1/2 top-8 -z-10 hidden h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#f7de12]/[0.04] blur-3xl sm:block" />

      <Container size="xl">
        <div
          className={[
            'grid min-h-[420px] items-center gap-8 py-16 sm:min-h-[460px] sm:py-20 lg:py-24',
            isAboutVariant ? 'lg:grid-cols-[1.05fr_0.75fr]' : '',
          ].join(' ')}
        >
          <div
            className={[
              'mx-auto max-w-4xl space-y-6',
              isAboutVariant ? 'text-left lg:mx-0' : 'text-center',
            ].join(' ')}
          >
            {eyebrow ? (
              <div
                className={[
                  'inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 shadow-xl shadow-black/20 backdrop-blur-md',
                  isAboutVariant ? '' : 'mx-auto',
                ].join(' ')}
              >
                <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-[#f7de12]">
                  <Image
                    src={WisdomeHouseLogo}
                    alt=""
                    fill
                    className="object-contain p-1.5"
                  />
                </span>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white/75">
                  {eyebrow}
                </span>
              </div>
            ) : null}

            <div className="space-y-4">
              <h1
                className={[
                  'text-balance font-semibold tracking-[-0.045em] text-white',
                  compact
                    ? 'text-3xl leading-[1.08] sm:text-4xl lg:text-5xl'
                    : 'text-[2.15rem] leading-[1.04] sm:text-5xl lg:text-6xl',
                ].join(' ')}
              >
                {title}
              </h1>

              {subtitle ? (
                <p className="max-w-3xl text-pretty text-base leading-8 text-white/76 sm:text-lg">
                  {subtitle}
                </p>
              ) : null}

              {supportingCopy ? (
                <p className="max-w-2xl text-pretty text-sm leading-7 text-white/58 sm:text-base">
                  {supportingCopy}
                </p>
              ) : null}
            </div>

            {chips?.length ? (
              <div
                className={[
                  'flex flex-wrap gap-2.5',
                  isAboutVariant ? 'justify-start' : 'justify-center',
                ].join(' ')}
              >
                {chips.map(chip => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-white/80 shadow-lg shadow-black/20"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}

            {showButtons ? (
              <div
                className={[
                  'flex flex-col gap-3 pt-2 sm:flex-row',
                  isAboutVariant ? 'sm:justify-start' : 'sm:justify-center',
                ].join(' ')}
              >
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f7de12] px-6 text-sm font-extrabold text-black shadow-lg shadow-[#f7de12]/20 transition hover:-translate-y-0.5 hover:bg-[#ffe93d]"
                >
                  {primaryButtonText}
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-bold text-white/85 transition hover:bg-white/[0.08]"
                >
                  {secondaryButtonText}
                </Link>
              </div>
            ) : null}
          </div>

          {isAboutVariant ? (
            <aside className="hidden lg:block">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#f7de12]/10 blur-3xl" />

                <div className="relative space-y-5">
                  <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-4">
                    <Image
                      src={WisdomeHouseLogo}
                      alt="The Wisdom Church"
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                      Our foundation
                    </p>
                    <p className="mt-3 text-lg font-semibold leading-7 text-white">
                      Word, worship, discipleship, and intentional community.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(chips ?? ['Wisdom', 'Power', 'Growth', 'Care']).map(
                      item => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center text-sm font-semibold text-white/75"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </aside>
          ) : null}
        </div>

        {showScrollIndicator ? (
          <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70">
              <ArrowDown size={16} />
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
