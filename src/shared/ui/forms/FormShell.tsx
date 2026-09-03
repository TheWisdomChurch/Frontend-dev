'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/cn';
import { Container, Page, Section } from '@/shared/ui/layout';

/* ============================================================================
   FormShell — the one public-form page frame: a single centred column, a
   compact hero, a slim completion bar, and a sticky action bar on mobile.
============================================================================ */

export interface FormShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Small pill facts under the hero, e.g. "8 questions", "~3 min". */
  metaChips?: string[];
  /** 0–1 completion of required fields; hidden when undefined. */
  progress?: number;
  /** Action bar (submit button + helper text). Also pinned to the foot on mobile. */
  actionBar?: ReactNode;
  children: ReactNode;
}

export function FormShell({
  eyebrow = 'The Wisdom Church',
  title,
  subtitle,
  metaChips = [],
  progress,
  actionBar,
  children,
}: FormShellProps) {
  const reduceMotion = useReducedMotion();
  const pct =
    typeof progress === 'number'
      ? Math.max(0, Math.min(100, Math.round(progress * 100)))
      : null;

  return (
    <Page tone="canvas">
      <Section tone="canvas" flush className="pb-24 pt-10 sm:pb-16 sm:pt-14">
        <Container width="content">
          <div className="mx-auto w-full max-w-[42rem]">
            <motion.header
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-balance font-ui text-heading-md font-semibold leading-tight tracking-[-0.02em] text-[var(--app-ink)] sm:text-heading-lg">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-3 max-w-[46ch] font-ui text-body-md leading-relaxed text-[var(--app-muted)]">
                  {subtitle}
                </p>
              ) : null}

              {metaChips.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {metaChips.map(chip => (
                    <li
                      key={chip}
                      className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1 font-ui text-caption font-medium text-[var(--app-muted)]"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.header>

            {pct !== null ? (
              <div
                className="sticky top-0 z-20 -mx-4 mt-6 border-b border-[var(--app-border)] bg-[var(--app-canvas)] px-4 py-3 sm:mx-0 sm:rounded-input sm:border-x sm:px-4"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Form completion"
              >
                <div className="flex items-center justify-between font-ui text-caption text-[var(--app-subtle)]">
                  <span>Your progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--app-canvas-3)]">
                  <div
                    className="h-full rounded-full bg-[var(--app-primary)] transition-[width] duration-500 ease-out"
                    // eslint-disable-next-line no-restricted-syntax -- dynamic completion width
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-8">{children}</div>
          </div>
        </Container>
      </Section>

      {actionBar ? (
        <div
          className={cn(
            'fixed inset-x-0 bottom-0 z-30 border-t border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 shadow-[0_-4px_20px_color-mix(in_srgb,black_8%,transparent)]',
            'sm:hidden'
          )}
        >
          <div className="mx-auto w-full max-w-[42rem]">{actionBar}</div>
        </div>
      ) : null}
    </Page>
  );
}
