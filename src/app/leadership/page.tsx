import { Church, ShieldCheck, Sparkles, Users } from 'lucide-react';
import SiteHero from '@/features/hero/SiteHero';
// import { apiClient } from '@/lib/api';
import type { LeadershipMember } from '@/domain/leadership/types';
import { formatLeadershipRole } from '@/domain/leadership/types';
import JsonLd from '@/shared/seo/JsonLd';
import { buildPersonSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { Page } from '@/shared/ui/layout';
import { LeadershipDirectory } from '@/features/leadership/LeadershipDirectory';
import SectionFlowDock, {
  type FlowDockItem,
} from '@/shared/components/SectionFlowDock';
import {
  CANONICAL_SENIOR_PASTORS,
  CANONICAL_CO_MINISTERS,
  CANONICAL_DEACONS,
} from '@/features/leadership/canonicalData';

// Approved leadership is CMS-managed content. Render it per request so a
// production build cannot freeze an empty or outdated directory indefinitely.
export const dynamic = 'force-dynamic';

const LEADERSHIP_FLOW_DOCK_ITEMS: readonly FlowDockItem[] = [
  {
    id: 'dock-senior-pastors',
    title: 'Senior Pastors',
    description: 'Bishop Gabriel Ayilara & Pastor Kehinde Ayilara',
    badge: 'Senior Pastors',
    icon: Church,
    targetId: 'senior-pastor',
  },
  {
    id: 'dock-resident-pastors',
    title: 'Resident Pastors',
    description: 'Rev. Victor Jimba & Pastor Bamidele Shepherding',
    badge: 'Resident Pastors',
    icon: Users,
    targetId: 'resident-pastors',
  },
  {
    id: 'dock-deacons',
    title: 'Deacons & Deaconesses',
    description: 'Service, administration & congregational care',
    badge: 'Deaconate',
    icon: ShieldCheck,
    targetId: 'deacons',
  },
  {
    id: 'dock-organogram',
    title: 'Leadership Organogram',
    description: 'Accountable biblical governance and ministry stewards',
    badge: 'Organogram',
    icon: Sparkles,
    targetId: 'resident-pastors',
  },
];

export default async function LeadershipPage() {
  // Dynamic CMS leadership endpoint temporarily commented out for organogram structure
  // const cmsLeaders: LeadershipMember[] = await apiClient
  //   .listLeadership()
  //   .catch(() => []);
  const cmsLeaders: LeadershipMember[] = [];

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

      {/* ── 1.1 Floating Navigation Dock: Matches Growth Portal Flow ─────────── */}
      <SectionFlowDock
        label="Leadership Organogram"
        items={LEADERSHIP_FLOW_DOCK_ITEMS}
      />

      {/* ── 2. Modern Directory & People Hierarchy ───────────── */}
      <LeadershipDirectory cmsLeaders={cmsLeaders} />
    </Page>
  );
}
