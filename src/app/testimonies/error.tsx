'use client';

import { ErrorView } from '@/shared/components/errors/ErrorView';

export default function TestimoniesError({ error, reset }: ErrorProps) {
  return (
    <ErrorView
      error={error}
      onRetry={reset}
      title="Testimonies could not load."
      message="Testimony content is temporarily unavailable. Please try again shortly."
    />
  );
}

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
