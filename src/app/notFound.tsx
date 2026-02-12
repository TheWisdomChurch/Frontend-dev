import Link from 'next/link';
import { BodyMD, H2 } from '@/components/text';
import { PageSection } from '@/components/layout';

export default function NotFound() {
  return (
    <PageSection tone="surface" padding="xl" container={false} centered fullHeight>
      <div className="text-center">
        <H2>404</H2>
        <BodyMD className="text-muted mb-4">Page Not Found</BodyMD>
        <Link href="/" className="page-card-muted inline-flex items-center px-5 py-2 text-sm font-medium">
          Go back home
        </Link>
      </div>
    </PageSection>
  );
}
