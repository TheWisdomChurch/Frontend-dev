import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { lader } from '@/shared/assets';
import { IMAGE_QUALITY } from '@/shared/constants';
import { Container } from '@/shared/ui/Container';

export type SiteHeroProps = {
  title: string;
  /** Split the headline across two lines; the second can take the gold accent. */
  titleLines?: readonly [string, string];
  highlightSecondLine?: boolean;
  eyebrow?: string;
  subtitle?: string;
  /** Secondary supporting line, shown smaller under the subtitle. */
  description?: string;
  note?: string;
  chips?: string[];
  actions?: ReactNode;
  backgroundImage?: string | StaticImageData;
  imagePositionClassName?: string;
  /** `home` = tall, lower-third text block, scroll cue. `page` = compact. */
  size?: 'page' | 'home';
  align?: 'left' | 'center';
  priority?: boolean;
};

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
  const isHome = size === 'home';
  const lines = titleLines ?? [title];
  const centered = align === 'center';

  return (
    <section
      data-site-hero
      className="tone-dark relative isolate flex flex-col overflow-hidden bg-[var(--app-dark)] text-white"
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
      {/* One restrained scrim — darker toward the base so text always holds. */}
      <div
        data-hero-overlay
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/40 to-black/70"
      />

      <Container className="flex flex-1 flex-col">
        <div
          data-hero-content
          className={cn(
            'flex w-full min-w-0 flex-1 flex-col',
            isHome
              ? 'min-h-[100svh] justify-end pb-[12svh] pt-[calc(var(--app-header-height)+var(--section-xs))] sm:pb-[14svh]'
              : 'min-h-[60svh] justify-end pb-section-sm pt-[calc(var(--app-header-height)+var(--section-sm))] sm:min-h-[68svh]',
            centered
              ? 'mx-auto max-w-4xl items-center text-center'
              : 'max-w-2xl items-start text-left'
          )}
        >
          {eyebrow ? (
            <p
              data-hero-item
              className="mb-5 font-ui text-eyebrow font-bold uppercase tracking-[0.24em] text-[var(--app-primary-light)]"
            >
              {eyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              'w-full max-w-full font-ui font-black leading-[0.96] tracking-[-0.03em] text-white drop-shadow-xl [text-wrap:balance]',
              isHome
                ? 'text-[clamp(2.35rem,8.5vw,5.5rem)]'
                : 'text-[clamp(2rem,6.5vw,3.75rem)]'
            )}
          >
            {lines.map((line, index) => (
              <span
                key={`${index}-${line}`}
                className="block overflow-hidden pb-[0.06em]"
              >
                <span
                  data-hero-title-line
                  className={cn(
                    'block',
                    index === 1 && highlightSecondLine
                      ? 'text-[var(--app-primary-light)]'
                      : 'text-white'
                  )}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {subtitle ? (
            <p
              data-hero-item
              className={cn(
                'mt-7 w-full font-ui text-lead leading-[1.6] text-white/85',
                centered ? 'max-w-2xl' : 'max-w-xl'
              )}
            >
              {subtitle}
            </p>
          ) : null}

          {description ? (
            <p
              data-hero-item
              className="mt-3 max-w-2xl font-ui text-body-md leading-relaxed text-white/60"
            >
              {description}
            </p>
          ) : null}

          {note ? (
            <p
              data-hero-item
              className="mt-3 max-w-2xl font-ui text-body-sm leading-relaxed text-white/55"
            >
              {note}
            </p>
          ) : null}

          {chips?.length ? (
            <div
              data-hero-item
              className={cn(
                'mt-7 flex flex-wrap gap-2.5',
                centered && 'justify-center'
              )}
            >
              {chips.map(chip => (
                <span
                  key={chip}
                  className="rounded-badge border border-white/25 px-3.5 py-1.5 font-ui text-label font-semibold text-white/75"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          {actions ? (
            <div
              data-hero-item
              className={cn(
                'mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap',
                centered && 'sm:justify-center'
              )}
            >
              {actions}
            </div>
          ) : null}
        </div>
      </Container>

      {isHome ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center motion-reduce:hidden"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/70 motion-safe:animate-bounce">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
      ) : null}
    </section>
  );
}
