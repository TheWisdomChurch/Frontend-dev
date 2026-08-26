import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { lader } from '@/shared/assets';
import { IMAGE_QUALITY } from '@/shared/constants';
import { Container } from '@/shared/layout';

export type SiteHeroProps = {
  title: string;
  titleLines?: readonly [string, string];
  highlightSecondLine?: boolean;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  note?: string;
  chips?: string[];
  actions?: ReactNode;
  backgroundImage?: string | StaticImageData;
  imagePositionClassName?: string;
  size?: 'page' | 'home';
  align?: 'left' | 'center';
  priority?: boolean;
  /** Legacy inputs retained for callers; neither changes visual architecture. */
  compact?: boolean;
  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
};

function balanceTitle(title: string): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length < 4 || title.length <= 24) return [title];

  let bestIndex = 1;
  let smallestDifference = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const firstLength = words.slice(0, index).join(' ').length;
    const secondLength = words.slice(index).join(' ').length;
    const difference = Math.abs(firstLength - secondLength);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      bestIndex = index;
    }
  }

  return [
    words.slice(0, bestIndex).join(' '),
    words.slice(bestIndex).join(' '),
  ];
}

export default function SiteHero({
  title,
  titleLines,
  highlightSecondLine = false,
  eyebrow,
  subtitle,
  description,
  note,
  chips,
  actions,
  backgroundImage = lader,
  imagePositionClassName,
  size = 'page',
  align = 'center',
}: SiteHeroProps) {
  const supportingCopy = subtitle ?? description ?? note;
  const resolvedTitleLines = titleLines ?? balanceTitle(title);
  const longestTitleLine = Math.max(
    ...resolvedTitleLines.map(line => line.length)
  );
  const titleSizeClass =
    longestTitleLine > 30
      ? 'text-[clamp(1.45rem,4.7vw,4.6rem)]'
      : longestTitleLine > 22
        ? 'text-[clamp(1.65rem,5.5vw,5.35rem)]'
        : 'text-[clamp(2.15rem,6.4vw,6.35rem)]';

  return (
    <section
      data-site-hero
      className="relative isolate overflow-hidden bg-[var(--app-dark)] text-white"
    >
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        quality={IMAGE_QUALITY}
        sizes="100vw"
        data-hero-media
        className={cn(
          '-z-20 object-cover object-center will-change-transform',
          imagePositionClassName
        )}
      />
      <div
        data-hero-overlay
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,.58)_0%,rgba(0,0,0,.48)_38%,rgba(0,0,0,.78)_100%)]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent" />

      <Container size="xl">
        <div
          data-hero-content
          className={cn(
            'flex min-h-[88svh] w-full min-w-0 flex-col justify-center pb-section-sm pt-[calc(var(--app-header-height)+var(--section-xs))] sm:min-h-screen',
            size === 'page' &&
              'min-h-[70svh] pb-section-xs sm:min-h-[76svh] lg:min-h-[82svh]',
            align === 'center'
              ? 'mx-auto max-w-6xl items-center text-center'
              : 'max-w-3xl items-start text-left'
          )}
        >
          {eyebrow ? (
            <p
              data-hero-item
              className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary-light)]"
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              'mt-5 w-full max-w-full font-ui font-medium leading-[0.98] tracking-[-0.045em] !text-white',
              titleSizeClass
            )}
          >
            {resolvedTitleLines.map((line, index) => (
              <span
                key={`${index}-${line}`}
                className="block overflow-hidden pb-[0.08em]"
              >
                <span
                  data-hero-title-line
                  className={cn(
                    'block whitespace-nowrap',
                    index === 1 && highlightSecondLine
                      ? 'font-normal text-[var(--app-primary-light)]'
                      : 'text-white'
                  )}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
          {supportingCopy ? (
            <p
              data-hero-item
              className="mt-6 w-full max-w-2xl font-ui text-lead leading-relaxed text-white/75"
            >
              {supportingCopy}
            </p>
          ) : null}
          {description && subtitle ? (
            <p
              data-hero-item
              className="mt-3 max-w-2xl font-ui text-body-md leading-loose text-white/60"
            >
              {description}
            </p>
          ) : null}
          {note && (subtitle || description) ? (
            <p
              data-hero-item
              className="mt-3 max-w-2xl font-ui text-body-md leading-loose text-white/60"
            >
              {note}
            </p>
          ) : null}
          {chips?.length ? (
            <div data-hero-item className="mt-6 flex flex-wrap gap-2">
              {chips.map(chip => (
                <span
                  key={chip}
                  className="rounded-badge border border-white/20 px-3 py-1.5 font-ui text-label font-semibold text-white/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
          {actions ? (
            <div
              data-hero-item
              className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap"
            >
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
