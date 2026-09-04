'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/cn';

/* ============================================================================
   Field shells for the public-form kit.

   - FloatingField : label rests inside the control and animates up to a caption
     on focus/fill. Used by text / textarea / select / phone / date inputs.
   - StaticField   : conventional label above. Used by option groups and the
     image picker where a floating label makes no sense.

   Both share one control recipe, one focus treatment, and one animated error
   row so every field on a form reads as a single system.
============================================================================ */

/** Base control surface. Height + top padding leave room for the floated label. */
export const controlClass =
  'peer w-full rounded-input border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 pb-2 pt-6 font-ui text-body-sm text-[var(--app-ink)] outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-transparent disabled:cursor-not-allowed disabled:opacity-60';

/** Control recipe for StaticField children (no floated label → normal padding). */
export const staticControlClass =
  'w-full min-h-11 rounded-input border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2.5 font-ui text-body-sm text-[var(--app-ink)] outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-[var(--app-subtle)] disabled:cursor-not-allowed disabled:opacity-60';

/** Focus ring, applied on `:focus` — pair with `controlClass`. */
export const controlFocusRing =
  'focus:border-[var(--app-primary)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--app-primary)_16%,transparent)]';

export const controlErrorClass =
  'border-[var(--status-error)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--status-error)_14%,transparent)] focus:border-[var(--status-error)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--status-error)_14%,transparent)]';

export const fieldLabelClass =
  'font-ui text-body-sm font-semibold leading-snug text-[var(--app-ink)]';

export const fieldHelpClass =
  'font-ui text-caption leading-relaxed text-[var(--app-subtle)]';

function ErrorRow({ id, error }: { id?: string; error?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {error ? (
        <motion.p
          id={id}
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
  );
}

/* ---------------------------------------------------------------------------
   FloatingField
--------------------------------------------------------------------------- */

interface FloatingChildArgs {
  onFocus: () => void;
  onBlur: () => void;
  'aria-invalid': boolean;
  'aria-describedby': string | undefined;
}

export interface FloatingFieldProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  /** Whether the control currently holds a value (drives the label position). */
  filled: boolean;
  error?: string;
  help?: ReactNode;
  /** Right-aligned adornment shown once the label has floated, e.g. a counter. */
  aside?: ReactNode;
  /** Resting label position — `top` for tall controls (textarea). */
  align?: 'center' | 'top';
  className?: string;
  children: (args: FloatingChildArgs) => ReactNode;
}

export function FloatingField({
  id,
  label,
  required = false,
  filled,
  error,
  help,
  aside,
  align = 'center',
  className,
  children,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReducedMotion();
  const floated = focused || filled;

  const errorId = error ? `${id}-error` : undefined;
  const helpId = help ? `${id}-help` : undefined;
  const describedBy = errorId ?? (focused ? helpId : undefined);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <motion.div
        className="relative"
        animate={
          error && !reduceMotion ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }
        }
        transition={{ duration: 0.32 }}
      >
        {children({
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          'aria-invalid': Boolean(error),
          'aria-describedby': describedBy,
        })}

        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-3.5 origin-left font-ui transition-all duration-200 ease-out',
            floated
              ? 'top-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em]'
              : align === 'top'
                ? 'top-[1.15rem] text-body-sm'
                : 'top-1/2 -translate-y-1/2 text-body-sm',
            error
              ? 'text-[var(--status-error)]'
              : focused
                ? 'text-[var(--app-primary-dark)]'
                : 'text-[var(--app-subtle)]'
          )}
        >
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>

        {aside && floated ? (
          <span className="pointer-events-none absolute right-3.5 top-2 font-ui text-[0.6875rem] font-medium text-[var(--app-subtle)]">
            {aside}
          </span>
        ) : null}
      </motion.div>

      {help && focused && !error ? (
        <p id={helpId} className={fieldHelpClass}>
          {help}
        </p>
      ) : null}

      <ErrorRow id={errorId} error={error} />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   StaticField
--------------------------------------------------------------------------- */

export interface StaticFieldProps {
  htmlFor?: string;
  label: ReactNode;
  required?: boolean;
  showOptional?: boolean;
  help?: ReactNode;
  error?: string;
  as?: 'label' | 'legend';
  className?: string;
  children: ReactNode;
}

export function StaticField({
  htmlFor,
  label,
  required = false,
  showOptional = true,
  help,
  error,
  as = 'label',
  className,
  children,
}: StaticFieldProps) {
  const errorId = htmlFor && error ? `${htmlFor}-error` : undefined;
  const helpId = htmlFor && help ? `${htmlFor}-help` : undefined;
  const LabelTag = as;
  const Wrapper = as === 'legend' ? 'fieldset' : 'div';

  return (
    <Wrapper className={cn('flex flex-col gap-2', className)}>
      <LabelTag
        {...(as === 'label' && htmlFor ? { htmlFor } : {})}
        className={fieldLabelClass}
      >
        {label}
        {required ? (
          <span className="text-[var(--app-primary-dark)]"> *</span>
        ) : showOptional ? (
          <span className="ml-1.5 font-ui text-caption font-normal normal-case tracking-normal text-[var(--app-subtle)]">
            (optional)
          </span>
        ) : null}
      </LabelTag>

      {children}

      {help && !error ? (
        <p id={helpId} className={fieldHelpClass}>
          {help}
        </p>
      ) : null}

      <ErrorRow id={errorId} error={error} />
    </Wrapper>
  );
}
