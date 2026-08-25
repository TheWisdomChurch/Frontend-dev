import Image from 'next/image';
import Link from 'next/link';
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';

import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';

type Tone = 'surface' | 'canvas' | 'dark' | 'brand';

const toneClasses: Record<Tone, string> = {
  surface: 'bg-[var(--app-surface)] text-[var(--app-ink)]',
  canvas: 'bg-[var(--app-canvas)] text-[var(--app-ink)]',
  dark: 'bg-[var(--app-dark)] text-white',
  brand: 'bg-[var(--app-primary)] text-[var(--app-ink)]',
};

export const editorialActionClass = {
  primary:
    'inline-flex min-h-12 items-center justify-center rounded-button bg-[var(--app-primary)] px-7 font-ui text-label font-bold uppercase tracking-widest text-[var(--app-ink)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)]',
  dark: 'inline-flex min-h-12 items-center justify-center rounded-button bg-[var(--app-dark)] px-7 font-ui text-label font-bold uppercase tracking-widest text-white transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-dark)]',
  outline:
    'inline-flex min-h-12 items-center justify-center rounded-button border border-current/20 px-7 font-ui text-label font-bold uppercase tracking-widest text-current transition hover:-translate-y-0.5 hover:border-current/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
} as const;

export function EditorialSection({
  tone = 'surface',
  compact = false,
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'section'> & {
  tone?: Tone;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-current/10',
        compact ? 'py-section-xs' : 'py-section-sm lg:py-section-md',
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function EditorialContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Container size="xl" className={className}>
      {children}
    </Container>
  );
}

export function EditorialSplit({
  children,
  reverse = false,
  className,
}: {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20',
        reverse && 'lg:[&>*:first-child]:order-2',
        className
      )}
    >
      {children}
    </div>
  );
}

export function EditorialHeader({
  eyebrow,
  title,
  description,
  tone = 'light',
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <ScrollFadeIn className={className}>
      <p
        className={cn(
          'font-ui text-eyebrow font-bold uppercase tracking-[0.22em]',
          tone === 'dark'
            ? 'text-[var(--app-primary)]'
            : 'text-[var(--app-primary-dark)]'
        )}
      >
        {eyebrow}
      </p>
      <h2 className="mt-4 text-balance font-headline text-display-sm font-semibold leading-tight tracking-tight sm:text-display-md">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-6 max-w-2xl font-ui text-body-lg leading-loose',
            tone === 'dark' ? 'text-white/70' : 'text-[var(--app-ink)]/70'
          )}
        >
          {description}
        </p>
      ) : null}
    </ScrollFadeIn>
  );
}

export function EditorialImage({
  alt,
  className,
  imageClassName,
  ...props
}: Omit<ComponentProps<typeof Image>, 'quality'> & {
  imageClassName?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-image bg-[var(--app-surface-2)]',
        className
      )}
    >
      <Image
        {...props}
        alt={alt}
        quality={IMAGE_QUALITY}
        className={cn('object-cover', imageClassName)}
      />
    </div>
  );
}

export function EditorialLink({
  variant = 'primary',
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: 'primary' | 'outline' | 'dark';
}) {
  return (
    <Link className={cn(editorialActionClass[variant], className)} {...props}>
      {children}
    </Link>
  );
}
