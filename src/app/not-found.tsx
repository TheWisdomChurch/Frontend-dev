import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

import SiteHero from '@/features/hero/SiteHero';
import {
  EditorialContainer,
  EditorialPanel,
  EditorialSection,
} from '@/shared/ui/editorial';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--app-dark)] text-white">
      <SiteHero
        title="That page could not be found."
        subtitle="The route may have changed, the page may have moved, or the link may no longer exist."
        note="Use the links below to get back to the main church pages without guessing where to go next."
        chips={['Home', 'Events', 'Resources', 'Contact']}
        compact
      />

      <EditorialSection tone="dark">
        <EditorialContainer>
          <div className="grid gap-4 md:grid-cols-2">
            <EditorialPanel
              tone="dark"
              className="p-6 transition hover:border-[var(--app-primary)]/40"
            >
              <Link href="/" className="block">
                <Home className="h-8 w-8 text-[var(--app-primary)]" />
                <h2 className="mt-4 font-ui text-heading-sm font-semibold text-white">
                  Go to homepage
                </h2>
                <p className="mt-2 font-ui text-body-md text-white/66">
                  Start again from the main landing page and navigate to the
                  section you need.
                </p>
              </Link>
            </EditorialPanel>

            <EditorialPanel
              tone="dark"
              className="p-6 transition hover:border-[var(--app-primary)]/40"
            >
              <Link href="/contact" className="block">
                <Compass className="h-8 w-8 text-[var(--app-primary)]" />
                <h2 className="mt-4 font-ui text-heading-sm font-semibold text-white">
                  Need help finding something?
                </h2>
                <p className="mt-2 font-ui text-body-md text-white/66">
                  Use the contact page if you were trying to reach the church or
                  need the right route quickly.
                </p>
              </Link>
            </EditorialPanel>
          </div>
        </EditorialContainer>
      </EditorialSection>
    </div>
  );
}
