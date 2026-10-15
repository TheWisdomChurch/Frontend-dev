'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';

import apiClient, { isApiError } from '@/lib/api';
import type { PublicFormPayload } from '@/lib/apiTypes';
import { PersonalizedFlyerGenerator } from '@/features/forms/PersonalizedFlyerGenerator';

function DPStudioContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slug = useMemo(() => {
    if (!pathname) return '';
    const segments = pathname.split('/').filter(Boolean);
    const formsIndex = segments.findIndex(segment => segment === 'forms');
    const nextSegment = segments[formsIndex + 1];
    return nextSegment ? decodeURIComponent(nextSegment) : '';
  }, [pathname]);

  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [form, setForm] = useState<PublicFormPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read initial query params passed from email or form submission
  const initialName = useMemo(() => {
    return (
      searchParams.get('name')?.trim() ||
      searchParams.get('firstName')?.trim() ||
      searchParams.get('first_name')?.trim() ||
      searchParams.get('attendee')?.trim() ||
      ''
    );
  }, [searchParams]);

  useEffect(() => {
    if (!slug) return;

    let mounted = true;

    apiClient
      .getPublicForm(slug)
      .then(data => {
        if (!mounted) return;
        setForm(data);
        setLoadedSlug(slug);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        if (isApiError(err) && err.statusCode === 404) {
          setError('This program or form could not be found.');
        } else {
          setError(
            err instanceof Error ? err.message : 'Failed to load form details.'
          );
        }
        setLoadedSlug(slug);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const activeError = !slug ? 'Form slug is missing' : error;
  const isActuallyLoading = Boolean(slug) && loadedSlug !== slug && !error;

  if (isActuallyLoading) {
    return (
      <div className="min-h-screen bg-[var(--app-dark)] text-white flex flex-col items-center justify-center p-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[var(--app-primary)]/20 border-t-[var(--app-primary-light)] animate-spin" />
          <Sparkles className="w-6 h-6 text-[var(--app-primary-light)] absolute" />
        </div>
        <p className="mt-4 text-xs font-semibold tracking-widest uppercase text-[var(--app-primary-light)]/80">
          Loading Attendee Studio…
        </p>
      </div>
    );
  }

  if (activeError || !form) {
    return (
      <div className="min-h-screen bg-[var(--app-dark)] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-2xl bg-white/[0.03] border border-white/10 p-8">
          <p className="text-[var(--app-primary-light)] font-semibold text-sm mb-2">
            Attendee Studio
          </p>
          <h1 className="text-xl font-bold mb-3">
            {activeError || 'Program not found'}
          </h1>
          <p className="text-sm text-white/60 mb-6">
            The program link may be incorrect, closed, or unpublished.
          </p>
          <Link
            href={`/forms/${slug || ''}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--app-primary)] hover:bg-[var(--app-primary-light)] text-[var(--app-dark)] font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Form
          </Link>
        </div>
      </div>
    );
  }

  // Determine flyer image URL priority:
  // 1. attendingBadgeSettings.customFlyerUrl
  // 2. form.settings?.eFlyerUrl
  // 3. form.settings?.coverImageUrl
  const flyerUrl =
    form.settings?.attendingBadgeSettings?.customFlyerUrl ||
    form.settings?.eFlyerUrl ||
    form.settings?.coverImageUrl ||
    '';

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/forms/${slug}`
      : `https://wisdomchurchhq.org/forms/${slug}`;

  return (
    <div className="min-h-screen bg-[var(--app-dark)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/forms/${slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration
          </Link>
          <span className="text-xs text-[var(--app-primary-light)] font-medium">
            Personalized E-Flyer Studio
          </span>
        </div>

        <PersonalizedFlyerGenerator
          flyerUrl={flyerUrl}
          eventName={form.title}
          eventDate={form.event?.startAt || form.event?.date || ''}
          initialAttendeeName={initialName}
          badgeSettings={form.settings?.attendingBadgeSettings}
          shareUrl={shareUrl}
        />
      </div>
    </div>
  );
}

export default function DPStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--app-dark)] text-white flex flex-col items-center justify-center p-6">
          <Loader2 className="w-8 h-8 text-[var(--app-primary-light)] animate-spin" />
        </div>
      }
    >
      <DPStudioContent />
    </Suspense>
  );
}
