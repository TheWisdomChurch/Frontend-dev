'use client';

import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/cn';

/* ============================================================================
   Field — the one shell every public-form control sits in. Sentence-case
   label, optional hint, help text, and an icon error row on a consistent
   rhythm. No per-field dividers: spacing comes from the parent grid/stack.
============================================================================ */

/** 44px control surface, single focus-ring recipe, shared by input/select/textarea. */
export const controlClass =
  'w-full min-h-11 rounded-input border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2.5 font-ui text-body-sm text-[var(--app-ink)] shadow-sm shadow-black/[0.04] outline-none transition placeholder:text-[var(--app-subtle)] focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-primary)_18%,transparent)] disabled:cursor-not-allowed disabled:opacity-60';

export const controlErrorClass =
  'border-[var(--status-error)] focus:border-[var(--status-error)] focus:ring-[color-mix(in_srgb,var(--status-error)_16%,transparent)]';

export const fieldLabelClass =
  'font-ui text-body-sm font-semibold leading-snug text-[var(--app-ink)]';

export const fieldHintClass =
  'font-ui text-caption font-normal normal-case tracking-normal text-[var(--app-subtle)]';

export const fieldHelpClass =
  'font-ui text-caption leading-relaxed text-[var(--app-subtle)]';

export interface FieldProps {
  /** Stable id for the control this Field labels. */
  htmlFor?: string;
  label: ReactNode;
  required?: boolean;
  /** Show a muted "(optional)" hint when the field is not required. */
  showOptional?: boolean;
  help?: ReactNode;
  error?: string;
  /** Right-aligned adornment beside the label, e.g. a word counter. */
  labelAside?: ReactNode;
  /** Render the label as a plain <span> (for fieldset/legend groups pass `as="legend"`). */
  as?: 'label' | 'legend' | 'span';
  className?: string;
  children: ReactNode;
}

export function Field({
  htmlFor,
  label,
  required = false,
  showOptional = true,
  help,
  error,
  labelAside,
  as = 'label',
  className,
  children,
}: FieldProps) {
  const errorId = htmlFor && error ? `${htmlFor}-error` : undefined;
  const helpId = htmlFor && help ? `${htmlFor}-help` : undefined;

  const LabelTag = as;
  // A <legend> is only meaningful inside a <fieldset>; grouped choice controls
  // (radio/checkbox groups) pass as="legend" and get the fieldset wrapper.
  const Wrapper = as === 'legend' ? 'fieldset' : 'div';

  return (
    <Wrapper className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <LabelTag
          {...(as === 'label' && htmlFor ? { htmlFor } : {})}
          className={fieldLabelClass}
        >
          {label}
          {required ? (
            <span className="text-[var(--app-primary-dark)]"> *</span>
          ) : showOptional ? (
            <span className={cn('ml-1.5', fieldHintClass)}>(optional)</span>
          ) : null}
        </LabelTag>
        {labelAside ? (
          <span className="shrink-0 font-ui text-caption text-[var(--app-subtle)]">
            {labelAside}
          </span>
        ) : null}
      </div>

      {children}

      {help && !error ? (
        <p id={helpId} className={fieldHelpClass}>
          {help}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 font-ui text-caption font-medium text-[var(--status-error)]"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </Wrapper>
  );
}
