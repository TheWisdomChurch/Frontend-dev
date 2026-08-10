import Image from 'next/image';
import { IMAGE_QUALITY } from '@/shared/constants';
import type { StaticImageData } from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { lader } from '@/shared/assets';
import { H1, BodyLG, BodyMD } from '@/shared/text';
import { Container, Section } from '@/shared/layout';
import { cn } from '@/lib/cn';

export type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** compact — short left-aligned editorial header */
  compact?: boolean;
  backgroundImage?: string | StaticImageData;
  /** Responsive Tailwind object-position classes for this hero image. */
  imagePositionClassName?: string;
  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  /** Supporting paragraph rendered below the subtitle. */
  description?: string;
  /** Supporting paragraph rendered below the subtitle (compact hero). */
  note?: string;
  /** Small pill tags rendered below the note/description. */
  chips?: string[];
};

function HeroChips({ chips }: { chips: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(chip => (
        <span
          key={chip}
          className="rounded-badge border border-white/15 bg-white/[0.04] px-3 py-1 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

export default function PageHero({
  title,
  subtitle,
  eyebrow,
  compact = false,
  backgroundImage,
  imagePositionClassName,
  showButtons = false,
  primaryButtonText = 'Plan your visit',
  secondaryButtonText = 'Learn more',
  description,
  note,
  chips,
}: PageHeroProps) {
  const bgSrc = backgroundImage ?? lader;

  return (
    <Section
      padding="none"
      className="relative isolate overflow-hidden text-white"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          quality={IMAGE_QUALITY}
          src={bgSrc}
          alt=""
          fill
          priority
          className={cn(
            'object-cover object-[center_24%] sm:object-[center_30%] lg:object-center',
            imagePositionClassName
          )}
          sizes="100vw"
        />

        {compact ? (
          /* Compact: directional gradient — dark left for text, shows photo right */
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--app-dark)]/92 via-[var(--app-dark)]/70 to-[var(--app-dark)]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-dark)]/60 via-transparent to-[var(--app-dark)]/30" />
          </>
        ) : (
          /* Full hero: even dark overlay with warm accent */
          <>
            <div className="absolute inset-0 bg-[var(--app-dark)]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_65%,rgba(201,150,26,0.14),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,transparent_50%,rgba(0,0,0,0.45)_100%)]" />
          </>
        )}
      </div>

      {/* Gold top accent line */}
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[var(--app-primary)]/55 to-transparent" />

      <Container size="xl">
        {compact ? (
          /* ── Compact: left-aligned, clears fixed 72px header ── */
          <div className="flex min-h-[360px] max-w-2xl flex-col justify-center gap-5 pb-14 pt-[calc(var(--app-header-height)+2.5rem)] sm:min-h-[400px] sm:pb-16">
            {eyebrow ? (
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                {eyebrow}
              </p>
            ) : null}
            <H1 className="font-headline text-heading-lg font-semibold leading-[1.16] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-heading-lg lg:text-display-sm">
              {title}
            </H1>
            {subtitle ? (
              <BodyMD className="max-w-lg leading-[1.85] text-white/65">
                {subtitle}
              </BodyMD>
            ) : null}
            {description ? (
              <BodyMD className="max-w-lg leading-[1.85] text-white/55">
                {description}
              </BodyMD>
            ) : null}
            {note ? (
              <BodyMD className="max-w-lg leading-[1.85] text-white/55">
                {note}
              </BodyMD>
            ) : null}
            {chips && chips.length > 0 ? <HeroChips chips={chips} /> : null}
          </div>
        ) : (
          /* ── Full hero: centered, tall ── */
          <div className="mx-auto flex min-h-[480px] max-w-3xl flex-col items-center justify-center gap-5 pb-24 pt-[calc(var(--app-header-height)+4rem)] text-center sm:min-h-[540px] sm:pb-28 sm:pt-[calc(var(--app-header-height)+5rem)]">
            {eyebrow ? (
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                {eyebrow}
              </p>
            ) : null}

            <div className="h-px w-12 bg-[var(--app-primary)]/55" />

            <H1 className="font-headline text-heading-lg font-semibold leading-[1.18] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)] sm:text-heading-lg lg:text-display-sm">
              {title}
            </H1>
            {subtitle ? (
              <BodyLG className="max-w-2xl leading-[1.85] text-white/70 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
                {subtitle}
              </BodyLG>
            ) : null}
            {description ? (
              <BodyMD className="max-w-xl leading-[1.85] text-white/58 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
                {description}
              </BodyMD>
            ) : null}
            {note ? (
              <BodyMD className="max-w-xl leading-[1.85] text-white/58 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
                {note}
              </BodyMD>
            ) : null}
            {chips && chips.length > 0 ? (
              <div className="flex justify-center">
                <HeroChips chips={chips} />
              </div>
            ) : null}

            {showButtons ? (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-button bg-[var(--app-primary)] px-7 font-ui text-label font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:brightness-105 active:scale-[0.98]"
                >
                  {primaryButtonText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-11 items-center justify-center rounded-button border border-white/20 bg-white/[0.06] px-7 font-ui text-label font-semibold text-white/75 backdrop-blur-sm transition hover:border-white/35 hover:text-white"
                >
                  {secondaryButtonText}
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </Container>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
    </Section>
  );
}
