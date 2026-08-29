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
  /**
   * Object-position / filter classes for the background image. Church photos
   * are portraits, so the frame defaults to `object-top` — pass
   * `object-center` for the few landscape images.
   */
  imagePositionClassName?: string;
  /** `home` = the largest headline. `page` = the same layout, a touch smaller. */
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
          '-z-20 object-cover object-[center_25%] will-change-transform',
          imagePositionClassName
        )}
      />

      {/* Top wash keeps the nav legible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/3 bg-gradient-to-b from-black/60 to-transparent"
      />
      {/* Gradient-masked backdrop blur over the lower band — softens a busy or
          bright photo behind the headline so the text always reads, while the
          upper photo stays sharp. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-md [-webkit-mask-image:linear-gradient(to_top,black_0%,black_34%,transparent_66%)] [mask-image:linear-gradient(to_top,black_0%,black_34%,transparent_66%)]"
      />
      {/* Deep base gradient — the text-contrast guarantee. */}
      <div
        data-hero-overlay
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--app-dark)_0%,color-mix(in_srgb,var(--app-dark)_78%,transparent)_26%,color-mix(in_srgb,var(--app-dark)_36%,transparent)_46%,transparent_68%)]"
      />

      <Container className="flex flex-1 flex-col">
        <div
          data-hero-content
          className={cn(
            'flex w-full min-w-0 flex-1 flex-col',
            'min-h-[100svh] justify-end pt-[calc(var(--app-header-height)+var(--section-xs))] pb-[11svh] sm:pb-[13svh] lg:pb-[10svh]',
            centered
              ? 'mx-auto max-w-4xl items-center text-center 2xl:max-w-5xl'
              : 'max-w-2xl items-start text-left 2xl:max-w-3xl'
          )}
        >
          {eyebrow ? (
            <p
              data-hero-item
              className="mb-5 font-ui text-eyebrow font-bold uppercase tracking-[0.24em] text-[var(--app-primary-light)] [text-shadow:0_1px_10px_black]"
            >
              {eyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              'w-full max-w-full font-ui font-black leading-[0.96] tracking-[-0.03em] text-white [text-shadow:0_2px_28px_black] [text-wrap:balance]',
              isHome
                ? 'text-[clamp(2.35rem,8vw,5.5rem)] 2xl:text-[6.25rem]'
                : 'text-[clamp(2.15rem,7vw,5rem)] 2xl:text-[5.5rem]'
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
                'mt-7 w-full font-ui text-lead leading-[1.6] text-white/90 [text-shadow:0_1px_14px_black]',
                centered ? 'max-w-2xl' : 'max-w-xl'
              )}
            >
              {subtitle}
            </p>
          ) : null}

          {description ? (
            <p
              data-hero-item
              className="mt-3 max-w-2xl font-ui text-body-md leading-relaxed text-white/78 [text-shadow:0_1px_12px_black]"
            >
              {description}
            </p>
          ) : null}

          {note ? (
            <p
              data-hero-item
              className="mt-3 max-w-2xl font-ui text-body-sm leading-relaxed text-white/75 [text-shadow:0_1px_12px_black]"
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
                  className="rounded-badge border border-[var(--app-border)] px-3.5 py-1.5 font-ui text-label font-semibold text-[var(--app-muted)]"
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

      <div
        data-hero-cue
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
    </section>
  );
}
