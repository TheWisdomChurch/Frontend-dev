'use client';

import { ErrorView } from '@/shared/components/errors/ErrorView';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorView
      error={error}
      onRetry={reset}
      title="This page is temporarily unavailable."
      message="The rest of the website may still be working. Try this page again, or return to the homepage."
    />
  );
}
