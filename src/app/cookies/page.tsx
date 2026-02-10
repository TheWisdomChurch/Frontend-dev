// app/cookies/page.tsx
import { BodyMD, BodySM, H2, H3 } from '@/components/text';
import { PageSection } from '@/components/layout';

export default function CookiesPage() {
  return (
    <PageSection tone="surface" padding="xl">
      <div className="max-w-4xl mx-auto space-y-6">
        <H2>Cookies & Privacy</H2>
        <BodyMD className="text-muted">
          We use only essential cookies to keep the site running and to remember
          basic preferences. No advertising trackers are used.
        </BodyMD>
        <div className="space-y-4">
          <div className="page-card p-5">
            <H3 className="mb-2">What we store</H3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted">
              <li>Session info for forms and cart actions.</li>
              <li>Light/dark mode preference when selected.</li>
              <li>Basic analytics (aggregated, non-identifying).</li>
            </ul>
          </div>
          <div className="page-card p-5">
            <H3 className="mb-2">Data handling</H3>
            <BodySM className="text-muted">
              Submitted forms (events, testimonies, contact) are used only to
              respond to your request and are not sold or shared with
              advertisers.
            </BodySM>
          </div>
          <div className="page-card p-5">
            <H3 className="mb-2">Your choices</H3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted">
              <li>You can clear cookies in your browser at any time.</li>
              <li>You may request deletion of your submitted data via the Contact page.</li>
            </ul>
          </div>
          <div className="page-card p-5">
            <H3 className="mb-2">Contact</H3>
            <BodySM className="text-muted">
              Questions about cookies or privacy? Reach us through the Contact
              page or at the church office.
            </BodySM>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
