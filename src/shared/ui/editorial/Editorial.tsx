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
    'inline-flex min-h-12 items-center justify-center rounded-button border border-current/35 bg-transparent px-7 font-ui text-label font-bold uppercase tracking-widest text-current transition hover:-translate-y-0.5 hover:border-current/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
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
  accent,
  description,
  tone = 'light',
  size = 'md',
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  description?: string;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <header className={className} data-gsap="reveal">
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
      <h2
        className={cn(
          'mt-5 text-balance font-ui font-medium leading-[1.02] tracking-[-0.045em]',
          size === 'sm' && 'text-heading-lg sm:text-display-sm',
          size === 'md' && 'text-display-sm sm:text-display-md',
          size === 'lg' &&
            'text-display-sm sm:text-display-md lg:text-display-lg',
          tone === 'dark' ? '!text-white' : '!text-[var(--app-ink)]'
        )}
      >
        {title}
        {accent ? (
          <>
            {' '}
            <span className="font-headline font-normal italic text-[var(--app-primary)]">
              {accent}
            </span>
          </>
        ) : null}
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
    </header>
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

export function EditorialEmptyState({
  title,
  description,
  action,
  tone = 'light',
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div
      data-gsap="reveal"
      className={cn(
        'flex min-h-[20rem] flex-col items-center justify-center rounded-card border px-6 py-14 text-center sm:px-10',
        tone === 'dark'
          ? 'border-white/12 bg-white/[0.035]'
          : 'border-[var(--app-border)] bg-[var(--app-surface)]',
        className
      )}
    >
      <span
        className="mb-7 h-px w-12 bg-[var(--app-primary)]"
        aria-hidden="true"
      />
      <h3
        className={cn(
          'max-w-xl font-headline text-heading-md font-semibold',
          tone === 'dark' ? '!text-white' : '!text-[var(--app-ink)]'
        )}
      >
        {title}
      </h3>
      {description ? (
        <p
          className={cn(
            'mt-4 max-w-lg font-ui text-body-md leading-loose',
            tone === 'dark' ? 'text-white/62' : 'text-[var(--app-ink)]/62'
          )}
        >
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-7">{action}</div> : null}
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
