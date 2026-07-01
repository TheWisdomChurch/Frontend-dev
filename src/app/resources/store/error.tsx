'use client';

import Link from 'next/link';

export default function StoreError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-[var(--app-dark)] px-6 text-center">
      <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
        Something went wrong
      </p>
      <h2 className="font-headline text-[2rem] font-normal text-white">
        The store could not load.
      </h2>
      <p className="max-w-md font-ui text-[0.85rem] leading-[2] text-white/65">
        There was a problem fetching store products. Try refreshing, or contact
        us if the problem persists.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="border border-white/20 px-6 py-3 font-ui text-[0.75rem] font-semibold text-white/70 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
        >
          Try again
        </button>
        <Link
          href="/contact"
          className="bg-[var(--app-primary)] px-6 py-3 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--app-ink)]"
        >
          Contact us
        </Link>
      </div>
    </main>
  );
}
