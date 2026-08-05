'use client';

import { ErrorView } from '@/shared/components/errors/ErrorView';

export default function FormError({ error, reset }: ErrorProps) {
  return (
    <ErrorView
      error={error}
      onRetry={reset}
      title="This form could not load."
      message="Try again, or use the contact page if you need immediate assistance."
      homeHref="/contact"
      homeLabel="Contact us"
    />
  );
}

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
