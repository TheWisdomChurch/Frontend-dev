'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/cn';

/* ============================================================================
   ConsentDisclosure — a compact privacy/consent block. One-line summary with
   the full notice tucked behind a toggle; the required acknowledgement stays
   visible at all times.
============================================================================ */

export interface ConsentContent {
  title: string;
  introduction: string;
  purposes: string[];
  dataUse: string;
  retention: string;
  rights: string;
  contact: string;
  acknowledgementLabel: string;
  version: string;
}

export interface ConsentDisclosureProps {
  consent: ConsentContent;
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  error?: string;
}

export function ConsentDisclosure({
  consent,
  accepted,
  onAcceptedChange,
  error,
}: ConsentDisclosureProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const detailBlocks: { label: string; body: string }[] = [
    { label: 'How your information is used', body: consent.dataUse },
    { label: 'How long it is kept', body: consent.retention },
    { label: 'Your rights', body: consent.rights },
    { label: 'Questions and corrections', body: consent.contact },
  ];

  return (
    <section
      aria-labelledby="consent-title"
      className="rounded-card border border-[var(--app-border)] bg-[var(--app-canvas)] p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--status-success)_14%,transparent)] text-[var(--status-success)]">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2
            id="consent-title"
            className="font-ui text-body-md font-semibold text-[var(--app-ink)]"
          >
            {consent.title}
          </h2>
          <p className="mt-1.5 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
            {consent.introduction}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        className="mt-4 flex items-center gap-1.5 font-ui text-caption font-semibold uppercase tracking-[0.14em] text-[var(--app-primary-dark)] transition hover:opacity-80"
      >
        {open ? 'Hide the full notice' : 'Read the full privacy notice'}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="detail"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4 border-t border-[var(--app-border)] pt-4">
              <div>
                <p className="font-ui text-caption font-semibold uppercase tracking-[0.12em] text-[var(--app-subtle)]">
                  What we do with your submission
                </p>
                <ul className="mt-2 space-y-1.5">
                  {consent.purposes.map(purpose => (
                    <li
                      key={purpose}
                      className="flex gap-2 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]"
                    >
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--status-success)]"
                        aria-hidden="true"
                      />
                      {purpose}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {detailBlocks.map(block => (
                  <div key={block.label}>
                    <p className="font-ui text-caption font-semibold uppercase tracking-[0.12em] text-[var(--app-subtle)]">
                      {block.label}
                    </p>
                    <p className="mt-1 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
                      {block.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <label
        className={cn(
          'mt-4 flex cursor-pointer items-start gap-3 rounded-input border bg-[var(--app-surface)] p-4 font-ui text-body-sm leading-relaxed text-[var(--app-muted)] transition',
          error
            ? 'border-[var(--status-error)] ring-2 ring-[color-mix(in_srgb,var(--status-error)_14%,transparent)]'
            : 'border-[var(--app-border)]'
        )}
      >
        <input
          type="checkbox"
          checked={accepted}
          onChange={event => onAcceptedChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--status-success)]"
        />
        <span>
          <span className="block font-semibold text-[var(--app-ink)]">
            Required acknowledgement
          </span>
          {consent.acknowledgementLabel}
        </span>
      </label>

      {error ? (
        <p
          role="alert"
          className="mt-2 font-ui text-caption font-medium text-[var(--status-error)]"
        >
          {error}
        </p>
      ) : null}

      <p className="mt-3 font-ui text-caption text-[var(--app-subtle)]">
        Privacy notice version {consent.version}
      </p>
    </section>
  );
}
