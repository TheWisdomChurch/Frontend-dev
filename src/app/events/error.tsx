'use client';

import { ErrorView } from '@/shared/components/errors/ErrorView';

export default function EventsError({ error, reset }: ErrorProps) {
  return (
    <ErrorView
      error={error}
      onRetry={reset}
      title="Events could not load."
      message="Event listings are temporarily unavailable. Try again or return to the homepage."
    />
  );
}

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
