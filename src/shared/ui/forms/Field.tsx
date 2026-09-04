'use client';

import { type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/cn';

/* ============================================================================
   Field — the one shell for every public-form control. Label sits above the
   field (works with the long, question-style labels these forms use), with a
   shared control recipe, an animated focus ring, and a shake + slide-in error.
============================================================================ */

export const controlClass =
  'w-full min-h-12 rounded-input border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-3 font-ui text-body-sm text-[var(--app-ink)] outline-none transition-[border-color,box-shadow] duration-200 ease-out placeholder:text-[var(--app-subtle)] disabled:cursor-not-allowed disabled:opacity-60';

export const controlFocusRing =
  'focus:border-[var(--app-primary)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--app-primary)_15%,transparent)]';

export const controlErrorClass =
  'border-[var(--status-error)] focus:border-[var(--status-error)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--status-error)_14%,transparent)]';

/** Alias kept for older imports. */
export const staticControlClass = controlClass;

export const fieldLabelClass =
  'font-ui text-body-sm font-semibold leading-snug text-[var(--app-ink)]';

export const fieldHelpClass =
  'font-ui text-caption leading-relaxed text-[var(--app-subtle)]';

export interface FieldProps {
  htmlFor?: string;
  label: ReactNode;
  required?: boolean;
  /** Show a muted "(optional)" when not required. */
  optional?: boolean;
  help?: ReactNode;
  error?: string;
  /** Right-aligned adornment beside the label (e.g. a word counter). */
  aside?: ReactNode;
  as?: 'label' | 'legend';
  className?: string;
  children: ReactNode;
}

export function Field({
  htmlFor,
  label,
  required = false,
  optional = true,
  help,
  error,
  aside,
  as = 'label',
  className,
  children,
}: FieldProps) {
  const reduceMotion = useReducedMotion();
  const Wrapper = as === 'legend' ? 'fieldset' : 'div';
  const LabelTag = as;
  const errorId = htmlFor && error ? `${htmlFor}-error` : undefined;
  const helpId = htmlFor && help ? `${htmlFor}-help` : undefined;

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
          ) : optional ? (
            <span className="ml-1.5 font-ui text-caption font-normal normal-case tracking-normal text-[var(--app-subtle)]">
              (optional)
            </span>
          ) : null}
        </LabelTag>
        {aside ? (
          <span className="shrink-0 font-ui text-caption text-[var(--app-subtle)]">
            {aside}
          </span>
        ) : null}
      </div>

      <motion.div
        animate={
          error && !reduceMotion ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }
        }
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {help && !error ? (
        <p id={helpId} className={fieldHelpClass}>
          {help}
        </p>
      ) : null}

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={errorId}
            role="alert"
            initial={reduceMotion ? false : { opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 overflow-hidden font-ui text-caption font-medium text-[var(--status-error)]"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

/** Backwards-compatible alias — StaticField and Field are the same now. */
export const StaticField = Field;
export type StaticFieldProps = FieldProps;
