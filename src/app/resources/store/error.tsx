'use client';

import { ErrorView } from '@/shared/components/errors/ErrorView';

export default function StoreError({ error, reset }: ErrorProps) {
  return (
    <ErrorView
      error={error}
      onRetry={reset}
      title="The store could not load."
      message="Products and ordering are temporarily unavailable. No order has been submitted."
      homeHref="/contact"
      homeLabel="Contact us"
    />
  );
}

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
