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
import {
  editorialActionClass,
  editorialInteractiveClass,
  editorialLabelClass,
  editorialToneClass,
  editorialWidthClass,
  type EditorialTone,
  type EditorialWidth,
} from './recipes';

export function EditorialPage({
  children,
  tone = 'canvas',
  className,
}: {
  children: ReactNode;
  tone?: EditorialTone;
  className?: string;
}) {
  return (
    <main className={cn('min-h-screen', editorialToneClass[tone], className)}>
      {children}
    </main>
  );
}

export function EditorialNotice({
  children,
  status = 'neutral',
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & {
  status?: 'neutral' | 'brand' | 'success' | 'error';
}) {
  return (
    <div
      className={cn(
        'rounded-card border px-5 py-4 font-ui text-body-sm leading-relaxed',
        status === 'neutral' &&
          'border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-muted)]',
        status === 'brand' &&
          'border-[var(--app-primary-20)] bg-[var(--app-primary-10)] text-[var(--app-muted)]',
        status === 'success' &&
          'border-[color-mix(in_srgb,var(--status-success)_30%,transparent)] bg-[color-mix(in_srgb,var(--status-success)_10%,transparent)] text-[var(--app-muted)]',
        status === 'error' &&
          'border-[color-mix(in_srgb,var(--status-error)_30%,transparent)] bg-[color-mix(in_srgb,var(--status-error)_10%,transparent)] text-[var(--status-error)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const EditorialSection = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<'section'> & {
    tone?: EditorialTone;
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
        !flush && (compact ? 'py-section-xs' : 'py-section-sm'),
        editorialToneClass[tone],
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
  width?: EditorialWidth;
}) {
  return (
    <Container size="xl" className={cn(editorialWidthClass[width], className)}>
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
      data-motion-group
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
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
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
  interactive = false,
  reveal = false,
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & {
  tone?: 'light' | 'dark';
  interactive?: boolean;
  reveal?: boolean;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card border transition-[transform,border-color,box-shadow,background-color] duration-500 ease-out',
        tone === 'dark'
          ? 'border-white/12 bg-white/[0.035] text-white'
          : 'border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-ink)]',
        interactive && editorialInteractiveClass,
        className
      )}
      data-gsap={reveal ? 'reveal' : undefined}
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
      data-motion-group
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

export function EditorialRail({
  children,
  columns = 3,
  className,
  itemWidth = 'wide',
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
  itemWidth?: 'compact' | 'wide';
}) {
  return (
    <div
      data-motion-group
      className={cn(
        '-mx-[var(--page-gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-[var(--page-gutter)] pb-5 [scrollbar-width:thin] md:mx-0 md:grid md:snap-none md:overflow-visible md:px-0 md:pb-0',
        itemWidth === 'compact'
          ? '[&>*]:w-[min(78vw,19rem)]'
          : '[&>*]:w-[min(86vw,25rem)]',
        '[&>*]:shrink-0 [&>*]:snap-start md:[&>*]:w-auto md:[&>*]:shrink',
        columns === 2 && 'md:grid-cols-2',
        columns === 3 && 'md:grid-cols-2 xl:grid-cols-3',
        columns === 4 && 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
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
  parallax = false,
  ...props
}: Omit<ComponentProps<typeof Image>, 'quality'> & {
  imageClassName?: string;
  parallax?: boolean;
}) {
  return (
    <div
      data-parallax-global={parallax ? '0.12' : undefined}
      className={cn(
        'relative overflow-hidden rounded-image bg-[var(--app-surface-2)]',
        className
      )}
    >
      <Image
        {...props}
        alt={alt}
        quality={IMAGE_QUALITY}
        className={cn(
          'object-cover transition-transform duration-700 ease-out',
          parallax && 'scale-[1.04]',
          imageClassName
        )}
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
