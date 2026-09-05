'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';

import { Button } from '@/shared/ui/button';
import { Notice } from '@/shared/ui/layout';
import { FormShell, FormSuccess } from '@/shared/ui/forms';
import { usePublicFormEngine } from '@/features/forms/usePublicFormEngine';
import { PublicFormFields } from '@/features/forms/PublicFormFields';

export default function PublicFormPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const formSlug = useMemo(() => {
    if (!pathname) return undefined;

    const segments = pathname.split('/').filter(Boolean);
    const formsIndex = segments.findIndex(segment => segment === 'forms');
    const nextSegment = segments[formsIndex + 1];

    return nextSegment ? decodeURIComponent(nextSegment) : undefined;
  }, [pathname]);

  const engine = usePublicFormEngine(formSlug);

  const returnPath = useMemo(() => {
    const raw = (searchParams.get('return_to') || '/').trim();
    if (!raw || !raw.startsWith('/')) return '/';
    return raw;
  }, [searchParams]);

  const returnDelayMs = useMemo(() => {
    const raw = searchParams.get('return_delay_ms');
    const parsed = raw ? Number(raw) : 0;
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return Math.min(parsed, 15000);
  }, [searchParams]);

  const returnLabel = useMemo(() => {
    return (searchParams.get('return_label') || '').trim() || 'Return home';
  }, [searchParams]);

  useEffect(() => {
    if (!engine.submitted || returnDelayMs <= 0) return undefined;

    const timer = window.setTimeout(() => {
      router.push(returnPath);
    }, returnDelayMs);

    return () => window.clearTimeout(timer);
  }, [engine.submitted, returnDelayMs, returnPath, router]);

  const { form, loading, error, submitting, presentation } = engine;

  const actionBar = (
    <div className="flex flex-col gap-2">
      <Button
        type="submit"
        form="public-form"
        variant="primary"
        size="lg"
        loading={submitting}
        fullWidth
      >
        {submitting ? 'Submitting…' : engine.submitLabel}
      </Button>
      <p className="text-center font-ui text-caption text-[var(--app-subtle)]">
        We will follow up using the details you provide.
      </p>
    </div>
  );

  if (loading) {
    return (
      <FormShell
        title="Loading form…"
        subtitle="One moment while we fetch this form."
      >
        <div className="space-y-3">
          {[0, 1, 2, 3].map(row => (
            <div
              key={row}
              className="h-16 animate-pulse rounded-input bg-[var(--app-canvas-2)]"
            />
          ))}
        </div>
      </FormShell>
    );
  }

  if (error && !form) {
    return (
      <FormShell
        title="This form could not load"
        subtitle="Please check the link and try again."
      >
        <Notice status="error">{error}</Notice>
      </FormShell>
    );
  }

  if (!form) return null;

  return (
    <>
      <FormShell
        title={presentation.title}
        subtitle={presentation.subtitle}
        metaChips={engine.metaChips}
        progress={engine.progress}
        actionBar={actionBar}
        coverImageUrl={form.settings?.coverImageUrl}
      >
        <form
          id="public-form"
          onSubmit={engine.handleSubmit}
          className="space-y-8"
        >
          <PublicFormFields engine={engine} reduceMotion={reduceMotion} />

          <div className="hidden border-t border-[var(--app-border)] pt-6 sm:block">
            {actionBar}
          </div>
        </form>
      </FormShell>

      <FormSuccess
        open={!loading && engine.submitted}
        onClose={() => router.push(returnPath)}
        title={presentation.successTitle}
        subtitle={presentation.successSubtitle || undefined}
        message={presentation.successMessage}
        primaryLabel={returnLabel}
        onPrimary={() => router.push(returnPath)}
      />
    </>
  );
}
