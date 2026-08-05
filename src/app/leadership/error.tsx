'use client';

import { ErrorView } from '@/shared/components/errors/ErrorView';

export default function LeadershipError({ error, reset }: ErrorProps) {
  return (
    <ErrorView
      error={error}
      onRetry={reset}
      title="Leadership profiles could not load."
      message="The leadership service is temporarily unavailable. Please try again shortly."
    />
  );
}

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
