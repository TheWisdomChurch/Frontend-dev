'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { EditorialPanel, editorialActionClass } from '@/shared/ui/editorial';

export interface ErrorViewProps {
  error?: Error & { digest?: string };
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  reload?: boolean;
  homeHref?: string;
  homeLabel?: string;
}

export function ErrorView({
  error,
  title = 'Something went wrong.',
  message = 'We could not complete this request. Please try again in a moment.',
  retryLabel = 'Try again',
  onRetry,
  reload = false,
  homeHref = '/',
  homeLabel = 'Go home',
}: ErrorViewProps) {
  useEffect(() => {
    if (error) {
      console.error('[ErrorBoundary]', {
        name: error.name,
        message: error.message,
        digest: error.digest,
      });
    }
  }, [error]);

  return (
    <main className="relative grid min-h-[70svh] place-items-center overflow-hidden bg-[var(--app-dark)] px-6 py-section-md text-center text-white">
      <EditorialPanel
        tone="dark"
        className="relative w-full max-w-2xl p-8 sm:p-12"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[var(--app-primary)]/25 bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>

        <p className="mt-6 font-ui text-xs font-bold uppercase tracking-[0.24em] text-[var(--app-primary)]">
          Temporary interruption
        </p>
        <h1 className="mt-3 font-ui text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-base leading-7 text-white/65">
          {message}
        </p>

        {error?.digest && (
          <p className="mt-4 font-mono text-xs text-white/35">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {(onRetry || reload) && (
            <button
              type="button"
              onClick={onRetry ?? (() => window.location.reload())}
              className={editorialActionClass.primary}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {retryLabel}
            </button>
          )}
          <Link href={homeHref} className={editorialActionClass.outline}>
            <Home className="h-4 w-4" aria-hidden="true" />
            {homeLabel}
          </Link>
        </div>
      </EditorialPanel>
    </main>
  );
}
