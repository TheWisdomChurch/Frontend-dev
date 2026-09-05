'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/cn';
import { BaseModal } from '@/shared/ui/modals/Modal';
import { Button, buttonClass } from '@/shared/ui/button';
import { Notice } from '@/shared/ui/layout';
import { FormSuccess } from '@/shared/ui/forms';
import { usePublicFormEngine } from '@/features/forms/usePublicFormEngine';
import { PublicFormFields } from '@/features/forms/PublicFormFields';
import { CHILDREN_FORM_SLUG } from './childrenRegistrationLink';

/* ============================================================================
   RegisterChildModal — lets a visitor register their child without leaving
   the Children's Ministry page.

   A tiny module-level pub/sub lets any number of stateless trigger buttons
   (`RegisterChildButton`) open the one modal instance (`RegisterChildModalHost`,
   mounted once on the page) — the same "many triggers, one modal" pattern
   used elsewhere on the site, so we never end up with duplicate modal trees.

   The form itself is `usePublicFormEngine(CHILDREN_FORM_SLUG)` — the exact
   hook the standalone `/forms/register-child` page and the external share
   link use, so a submission made here, on that page, or through the link you
   hand to someone outside the site all land in the same place on the
   backend.
============================================================================ */

const listeners = new Set<() => void>();

export function openRegisterChildModal() {
  listeners.forEach(listener => listener());
}

interface RegisterChildButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'dark';
  className?: string;
}

export function RegisterChildButton({
  children,
  variant = 'primary',
  className,
}: RegisterChildButtonProps) {
  return (
    <button
      type="button"
      onClick={openRegisterChildModal}
      className={cn(buttonClass(variant), className)}
    >
      {children}
    </button>
  );
}

export function RegisterChildModalHost() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const open = () => setIsOpen(true);
    listeners.add(open);
    return () => {
      listeners.delete(open);
    };
  }, []);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={close}
      tone="light"
      maxWidth="max-w-xl"
      ariaLabel="Register your child"
    >
      {isOpen ? <RegisterChildModalBody onClose={close} /> : null}
    </BaseModal>
  );
}

function RegisterChildModalBody({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const engine = usePublicFormEngine(CHILDREN_FORM_SLUG);
  const { form, loading, error, submitting, presentation } = engine;

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2, 3].map(row => (
          <div
            key={row}
            className="h-14 animate-pulse rounded-input bg-[var(--app-canvas-2)]"
          />
        ))}
      </div>
    );
  }

  if (error && !form) {
    return (
      <div>
        <h2 className="font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
          This form could not load
        </h2>
        <Notice status="error" className="mt-3">
          {error}
        </Notice>
      </div>
    );
  }

  if (!form) return null;

  return (
    <>
      <div className="mb-6">
        <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">
          The Wisdom Church
        </p>
        <h2 className="mt-2 text-balance font-ui text-heading-sm font-semibold leading-tight text-[var(--app-ink)] sm:text-heading-md">
          {presentation.title}
        </h2>
        {presentation.subtitle ? (
          <p className="mt-2 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
            {presentation.subtitle}
          </p>
        ) : null}
      </div>

      <form onSubmit={engine.handleSubmit} className="space-y-6">
        <PublicFormFields engine={engine} reduceMotion={reduceMotion} />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={submitting}
          fullWidth
        >
          {submitting ? 'Submitting…' : engine.submitLabel}
        </Button>
      </form>

      <FormSuccess
        open={engine.submitted}
        onClose={onClose}
        title={presentation.successTitle}
        subtitle={presentation.successSubtitle || undefined}
        message={presentation.successMessage}
        primaryLabel="Done"
        onPrimary={onClose}
      />
    </>
  );
}
