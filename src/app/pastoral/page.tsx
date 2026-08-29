import { Suspense } from 'react';

import SiteHero from '@/features/hero/SiteHero';
import PastoralCareForm from '@/shared/ui/forms/eventsForm/PastoralCare';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
import {
  Container,
  Page,
  SectionHeader,
  CtaLink,
  Section,
} from '@/shared/ui/layout';

// Metadata for this route lives in pastoral/layout.tsx — a single source
// of truth for title/description/canonical/OG/twitter instead of two
// partially-overlapping exports.

export default function PastoralPage() {
  return (
    <Page>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Pastoral Care', path: '/pastoral' },
        ])}
      />

      <SiteHero
        backgroundImage="/Picflow/DSC00122 copy.webp"
        eyebrow="Pastoral Care"
        title="Care is always available here."
        subtitle="Prayer, confidential counseling, or booking a minister for your event — pick what you need below and we'll take it from there."
      />

      <Suspense fallback={null}>
        <PastoralCareForm />
      </Suspense>

      <Section tone="canvas">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-20">
            <SectionHeader
              eyebrow="Handled with care"
              title="Everything you share is treated with discretion."
            />
            <div className="border-t border-[var(--app-border)] pt-6">
              <p className="max-w-2xl font-ui text-body-lg leading-loose text-[var(--app-muted)]">
                Pastoral care works best when people can speak openly. Sensitive
                matters are handled by our pastoral team with maturity,
                confidentiality, and respect for the person involved. You will
                always know the next step.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="dark">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader
              eyebrow="Prefer to reach us directly?"
              title="You do not have to carry this"
              accent="alone."
              description="If the form above does not fit what you need, reach our team directly and we will make sure it gets to the right person."
              tone="dark"
            />
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <CtaLink href="/contact">Contact us</CtaLink>
              <CtaLink href="/events/weekly" variant="outline">
                View service times
              </CtaLink>
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
