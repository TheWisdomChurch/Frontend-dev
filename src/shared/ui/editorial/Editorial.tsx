import Image from 'next/image';
import Link from 'next/link';
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';
import { Container } from '@/shared/layout';

type Tone = 'surface' | 'canvas' | 'muted' | 'dark' | 'brand';
type Width = 'narrow' | 'content' | 'wide';

const toneClasses: Record<Tone, string> = {
  surface: 'bg-[var(--app-surface)] text-[var(--app-ink)]',
  canvas: 'bg-[var(--app-canvas)] text-[var(--app-ink)]',
  muted: 'bg-[var(--app-canvas-2)] text-[var(--app-ink)]',
  dark: 'bg-[var(--app-dark)] text-white',
  brand: 'bg-[var(--app-primary)] text-[var(--app-ink)]',
};

const widthClasses: Record<Width, string> = {
  narrow: 'max-w-3xl',
  content: 'max-w-5xl',
  wide: 'max-w-7xl',
};

export function EditorialPage({
  children,
  tone = 'canvas',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <main className={cn('min-h-screen', toneClasses[tone], className)}>
      {children}
    </main>
  );
}

export const editorialActionClass = {
  primary:
    'inline-flex min-h-12 items-center justify-center rounded-button bg-[var(--app-primary)] px-7 font-ui text-label font-bold uppercase tracking-widest text-[var(--app-ink)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)]',
  dark: 'inline-flex min-h-12 items-center justify-center rounded-button bg-[var(--app-dark)] px-7 font-ui text-label font-bold uppercase tracking-widest text-white transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-dark)]',
  outline:
    'inline-flex min-h-12 items-center justify-center rounded-button border border-current/35 bg-transparent px-7 font-ui text-label font-bold uppercase tracking-widest text-current transition hover:-translate-y-0.5 hover:border-current/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
} as const;

export const editorialFieldClass =
  'w-full rounded-input border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 font-ui text-body-sm text-[var(--app-ink)] placeholder:text-[var(--app-subtle)] outline-none transition focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary)]/15';

export const editorialLabelClass =
  'block font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-subtle)]';

export const EditorialSection = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<'section'> & {
    tone?: Tone;
    compact?: boolean;
    flush?: boolean;
  }
>(function EditorialSection(
  {
    tone = 'surface',
    compact = false,
    flush = false,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <section
      ref={ref}
      className={cn(
        'relative overflow-hidden border-b border-current/10',
        !flush &&
          (compact ? 'py-section-xs' : 'py-section-sm lg:py-section-md'),
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
});

export function EditorialContainer({
  children,
  className,
  width = 'wide',
}: {
  children: ReactNode;
  className?: string;
  width?: Width;
}) {
  return (
    <Container size="xl" className={cn(widthClasses[width], className)}>
      {children}
    </Container>
  );
}

export function EditorialStack({
  children,
  gap = 'md',
  className,
}: {
  children: ReactNode;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col',
        gap === 'sm' && 'gap-4',
        gap === 'md' && 'gap-7',
        gap === 'lg' && 'gap-10 lg:gap-14',
        className
      )}
    >
      {children}
    </div>
  );
}

export function EditorialActions({
  children,
  align = 'start',
  className,
}: {
  children: ReactNode;
  align?: 'start' | 'center' | 'between';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3',
        align === 'center' && 'justify-center',
        align === 'between' && 'justify-between',
        className
      )}
    >
      {children}
    </div>
  );
}

export type EditorialDocumentSection = {
  id: string;
  title: string;
  body?: string;
  items?: readonly string[];
  links?: readonly { href: string; label: string }[];
};

export function EditorialDocument({
  sections,
  navigation,
  navigationLabel = 'Sections',
}: {
  sections: readonly EditorialDocumentSection[];
  navigation?: readonly { href: string; label: string }[];
  navigationLabel?: string;
}) {
  return (
    <EditorialSection tone="canvas">
      <EditorialContainer width="content">
        <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <aside className="hidden lg:block">
            <nav
              className="sticky top-24"
              aria-label={`${navigationLabel} table of contents`}
            >
              <p className={editorialLabelClass}>{navigationLabel}</p>
              <ul className="mt-4 space-y-1.5">
                {sections.map(section => (
                  <li key={section.id}>
                    <a
                      className="block py-1 font-ui text-label text-[var(--app-subtle)] transition hover:text-[var(--app-primary-dark)]"
                      href={`#${section.id}`}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
              {navigation?.length ? (
                <div className="mt-8 space-y-2 border-t border-[var(--app-border)] pt-6">
                  {navigation.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block font-ui text-label text-[var(--app-muted)] transition hover:text-[var(--app-primary-dark)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </nav>
          </aside>
          <article>
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className={cn(
                  'scroll-mt-24 py-10 first:pt-0 last:pb-0',
                  index < sections.length - 1 &&
                    'border-b border-[var(--app-border)]'
                )}
              >
                <h2 className="font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
                  {section.title}
                </h2>
                {section.body ? (
                  <p className="mt-4 font-ui text-body-md leading-loose text-[var(--app-muted)]">
                    {section.body}
                  </p>
                ) : null}
                {section.items?.length ? (
                  <ul className="mt-4 space-y-3">
                    {section.items.map(item => (
                      <li
                        key={item}
                        className="flex items-start gap-3 font-ui text-body-md leading-loose text-[var(--app-muted)]"
                      >
                        <span
                          className="mt-3 h-0.5 w-3.5 flex-none bg-[var(--app-primary)]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.links?.length ? (
                  <EditorialActions className="mt-5">
                    {section.links.map(item => (
                      <EditorialLink
                        key={item.href}
                        href={item.href}
                        variant="text"
                      >
                        {item.label}
                      </EditorialLink>
                    ))}
                  </EditorialActions>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </EditorialContainer>
    </EditorialSection>
  );
}

export function EditorialPanel({
  children,
  tone = 'light',
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & {
  tone?: 'light' | 'dark';
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card border',
        tone === 'dark'
          ? 'border-white/12 bg-white/[0.035] text-white'
          : 'border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-ink)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
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
            <span className="font-ui font-normal text-[var(--app-primary)]">
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
  variant?: 'primary' | 'outline' | 'dark' | 'text';
}) {
  return (
    <Link
      className={cn(
        variant === 'text'
          ? 'font-ui text-body-sm font-semibold text-[var(--app-primary-dark)] underline decoration-current/35 underline-offset-4 transition hover:text-[var(--app-primary)]'
          : editorialActionClass[variant],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
