import SiteHero from '@/features/hero/SiteHero';
import { apiClient } from '@/lib/api';
import type { LeadershipMember } from '@/domain/leadership/types';
import { formatLeadershipRole } from '@/domain/leadership/types';
import JsonLd from '@/shared/seo/JsonLd';
import { buildPersonSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { Page } from '@/shared/ui/layout';
import { LeadershipDirectory } from '@/features/leadership/LeadershipDirectory';
import {
  CANONICAL_SENIOR_PASTORS,
  CANONICAL_CO_MINISTERS,
  CANONICAL_DEACONS,
} from '@/features/leadership/canonicalData';

// Approved leadership is CMS-managed content. Render it per request so a
// production build cannot freeze an empty or outdated directory indefinitely.
export const dynamic = 'force-dynamic';

export default async function LeadershipPage() {
  // Fetch dynamic CMS leadership, with graceful fallback to empty array
  const cmsLeaders: LeadershipMember[] = await apiClient
    .listLeadership()
    .catch(() => []);

  // Combined set of leaders for search engine rich snippets
  const allLeadersForSchema = [
    ...CANONICAL_SENIOR_PASTORS,
    ...CANONICAL_CO_MINISTERS,
    ...CANONICAL_DEACONS,
    ...cmsLeaders,
  ];

  return (
    <Page>
      {/* ── SEO Structured Data ──────────────────────────────── */}
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Leadership', path: '/leadership' },
        ])}
      />

      {allLeadersForSchema.map(leader => (
        <JsonLd
          key={leader.id}
          data={buildPersonSchema({
            name: `${leader.firstName} ${leader.lastName}`.trim(),
            role: formatLeadershipRole(leader.role),
            bio: leader.bio || undefined,
            imageUrl: leader.imageUrl || undefined,
            path: '/leadership',
          })}
        />
      ))}

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <SiteHero
        backgroundImage="/Picflow/DSC00058-copy.webp"
        imagePositionClassName="object-center"
        eyebrow="Leadership & Ministry"
        title="The people who shepherd this church."
        subtitle="Called, committed, and accountable — meet the pastors, deacons, and ministry leaders who serve the Wisdom Church family."
      />

      {/* ── 2. Modern Directory & People Hierarchy ───────────── */}
      <LeadershipDirectory cmsLeaders={cmsLeaders} />
    </Page>
  );
}
