import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { lader } from '@/shared/assets';
import { IMAGE_QUALITY } from '@/shared/constants';
import { Container } from '@/shared/layout';

export type SiteHeroProps = {
  title: string;
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
  /** Legacy input retained during route migration. */
  compact?: boolean;
  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
};

export default function SiteHero({
  title,
  eyebrow,
  subtitle,
  description,
  note,
  chips,
  actions,
  backgroundImage = lader,
  imagePositionClassName,
  size = 'page',
  align = 'left',
  priority = false,
}: SiteHeroProps) {
  const supportingCopy = subtitle ?? description ?? note;
  const isHome = size === 'home';

  return (
    <section className="relative isolate overflow-hidden bg-[var(--app-dark)] text-white">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority={priority || isHome}
        quality={IMAGE_QUALITY}
        sizes="100vw"
        className={cn(
          ' -z-20 object-cover object-center',
          imagePositionClassName
        )}
      />
      <div className="absolute inset-0 -z-10 bg-black/60" />

      <Container size="xl">
        <div
          className={cn(
            'flex flex-col justify-center pt-[calc(var(--app-header-height)+var(--section-xs))]',
            isHome
              ? 'min-h-[88svh] pb-section-sm sm:min-h-screen'
              : 'min-h-[26rem] pb-section-xs sm:min-h-[30rem]',
            align === 'center'
              ? 'mx-auto max-w-4xl items-center text-center'
              : 'max-w-3xl items-start text-left'
          )}
        >
          {eyebrow ? (
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary-light)]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              'mt-5 text-balance font-headline font-semibold leading-none tracking-tight',
              isHome
                ? 'text-display-md sm:text-display-lg lg:text-display-xl'
                : 'text-display-sm sm:text-display-md'
            )}
          >
            {title}
          </h1>
          {supportingCopy ? (
            <p className="mt-6 max-w-2xl font-ui text-lead leading-relaxed text-white/75">
              {supportingCopy}
            </p>
          ) : null}
          {description && subtitle ? (
            <p className="mt-3 max-w-2xl font-ui text-body-md leading-loose text-white/60">
              {description}
            </p>
          ) : null}
          {note && (subtitle || description) ? (
            <p className="mt-3 max-w-2xl font-ui text-body-md leading-loose text-white/60">
              {note}
            </p>
          ) : null}
          {chips?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {actions}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
