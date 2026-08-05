'use client';

import { ErrorView } from '@/shared/components/errors/ErrorView';

export default function SermonsError({ error, reset }: ErrorProps) {
  return (
    <ErrorView
      error={error}
      onRetry={reset}
      title="Sermons could not load."
      message="Sermon content is temporarily unavailable. Try again or browse the other resources."
      homeHref="/resources"
      homeLabel="All resources"
    />
  );
}

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
