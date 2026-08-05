import type { Metadata } from 'next';
import { ErrorView } from '@/shared/components/errors/ErrorView';

export const metadata: Metadata = {
  title: 'Service temporarily unavailable',
  robots: { index: false, follow: false },
};

export default function ServiceUnavailablePage() {
  return (
    <ErrorView
      title="We will be back shortly."
      message="The website or one of its services is undergoing a temporary interruption. Please try again shortly."
      reload
      retryLabel="Check again"
    />
  );
}
