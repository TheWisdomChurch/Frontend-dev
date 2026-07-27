'use client';

import Link from 'next/link';

export default function TestimoniesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-[var(--app-dark)] px-6 text-center">
      <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
        Something went wrong
      </p>
      <h2 className="font-headline text-[2rem] font-normal text-white">
        Testimonies could not load.
      </h2>
      <p className="max-w-md font-ui text-body-sm leading-[2] text-white/65">
        There was a problem loading testimonies. Try refreshing, or check back
        shortly.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="border border-white/20 px-6 py-3 font-ui text-label font-semibold text-white/70 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-[var(--app-primary)] px-6 py-3 font-ui text-label font-bold uppercase tracking-[0.14em] text-[var(--app-ink)]"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
