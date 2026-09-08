import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { apiClient } from '@/lib/api';
import type {
  LeadershipMember,
  LeadershipRoleSlug,
} from '@/domain/leadership/types';
import { formatLeadershipRole } from '@/domain/leadership/types';
import JsonLd from '@/shared/seo/JsonLd';
import { buildPersonSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { LeaderCard } from '@/features/leadership/LeadershipCards';
import {
  Container,
  Page,
  SectionEmpty,
  SectionHeader,
  CtaLink,
  Section,
} from '@/shared/ui/layout';

// Approved leadership is CMS-managed content. Render it per request so a
// production build cannot freeze an empty or outdated directory indefinitely.
export const dynamic = 'force-dynamic';

const SENIOR_ROLES: LeadershipRoleSlug[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
];
const BOARD_ROLES: LeadershipRoleSlug[] = ['deacon', 'deaconess'];

const ROLE_RANK: Record<string, number> = {
  senior_pastor: 0,
  associate_pastor: 1,
  reverend: 2,
  deacon: 3,
  deaconess: 4,
};

function isSeniorRole(role: string) {
  return (SENIOR_ROLES as string[]).includes(role);
}
function isBoardRole(role: string) {
  return (BOARD_ROLES as string[]).includes(role);
}

function byRoleThenName(a: LeadershipMember, b: LeadershipMember) {
  // Unknown (free-text) roles rank after the canonical ones, then alphabetically.
  const rankA = ROLE_RANK[a.role] ?? 90;
  const rankB = ROLE_RANK[b.role] ?? 90;
  if (rankA !== rankB) return rankA - rankB;
  const roleCompare = formatLeadershipRole(a.role).localeCompare(
    formatLeadershipRole(b.role)
  );
  if (roleCompare !== 0) return roleCompare;
  return `${a.firstName} ${a.lastName}`.localeCompare(
    `${b.firstName} ${b.lastName}`
  );
}

/* ── One leader group: header + premium portrait grid ───── */

function LeaderGroup({
  eyebrow,
  title,
  accent,
  description,
  leaders,
  tone,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  leaders: LeadershipMember[];
  tone: 'dark' | 'canvas';
}) {
  if (leaders.length === 0) return null;
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          description={description}
          tone={tone === 'dark' ? 'dark' : undefined}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leaders.map((leader, i) => (
            <ScrollFadeIn key={leader.id} delay={Math.min(i, 5) * 0.06}>
              <LeaderCard leader={leader} tone={tone} />
            </ScrollFadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default async function LeadershipPage() {
  // The directory is CMS-managed and often empty in non-production. A transport
  // failure (API unreachable, cold start, rate limit) should fall back to the
  // "coming soon" empty state rather than crash the route to its error page.
  const leaders = (await apiClient.listLeadership().catch(() => [])).sort(
    byRoleThenName
  );

  const seniorTeam = leaders.filter(l => isSeniorRole(l.role));
  const board = leaders.filter(l => isBoardRole(l.role));
  const others = leaders.filter(
    l => !isSeniorRole(l.role) && !isBoardRole(l.role)
  );

  return (
    <Page>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Leadership', path: '/leadership' },
        ])}
      />

      {leaders.map(leader => (
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
        eyebrow="Leadership"
        title="The people who shepherd this church."
        subtitle="Called, committed, and accountable — meet the team that serves the Wisdom Church community."
      />

      {/* ── 2. Directory ─────────────────────────────────────── */}
      {leaders.length === 0 ? (
        <Section tone="dark">
          <Container>
            <SectionHeader
              eyebrow="Our leadership"
              title="Shepherds of the"
              accent="Word and community."
              tone="dark"
            />
            <div className="mt-10">
              <SectionEmpty
                title="Leadership listings coming soon."
                description="Our leadership directory will be published here shortly."
                tone="dark"
              />
            </div>
          </Container>
        </Section>
      ) : (
        <>
          <LeaderGroup
            tone="dark"
            eyebrow="Pastoral leadership"
            title="Shepherds of the"
            accent="Word and community."
            description="The pastors who carry the vision, teach the Word, and give spiritual oversight to the church."
            leaders={seniorTeam}
          />
          <LeaderGroup
            tone="canvas"
            eyebrow="Board of leaders"
            title="Deacons & Deaconesses."
            description="Trusted men and women who serve the day-to-day life of the church and care for the congregation."
            leaders={board}
          />
          <LeaderGroup
            tone="canvas"
            eyebrow="Ministry leadership"
            title="Serving across the church."
            leaders={others}
          />
        </>
      )}

      {/* ── 3. CTA ───────────────────────────────────────────── */}
      <Section tone="brand">
        <Container className="text-center">
          <SectionHeader
            align="center"
            eyebrow="Serve with us"
            title="Leadership is an invitation,"
            accent="not just a title."
            description="If you feel called to serve the church in a meaningful way, we would love to have a conversation with you."
            className="mx-auto max-w-3xl"
          />
          <div className="mt-8 flex justify-center">
            <CtaLink href="/contact" variant="dark">
              Get in touch
            </CtaLink>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
