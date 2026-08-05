'use client';

import '@/app/globals.scss';
import { ErrorView } from '@/shared/components/errors/ErrorView';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07060a]">
        <ErrorView
          error={error}
          onRetry={reset}
          title="The website hit an unexpected problem."
          message="We have isolated the failure so you can retry safely. If it continues, please return shortly."
        />
      </body>
    </html>
  );
}
