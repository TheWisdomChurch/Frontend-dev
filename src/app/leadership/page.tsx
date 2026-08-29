import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { apiClient } from '@/lib/api';
import type { LeadershipRole } from '@/domain/leadership/types';
import JsonLd from '@/shared/seo/JsonLd';
import { buildPersonSchema, buildBreadcrumbSchema } from '@/lib/seo';
import {
  LeaderCard,
  ROLE_LABEL,
  initials,
} from '@/features/leadership/LeadershipCards';
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

const SENIOR_ROLES: LeadershipRole[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
];
const BOARD_ROLES: LeadershipRole[] = ['deacon', 'deaconess'];

/* ── Empty state ────────────────────────────────────────── */

function EmptyState({ dark }: { dark?: boolean }) {
  return (
    <SectionEmpty
      title="Leadership listings coming soon."
      description="Our leadership directory will be published here shortly."
      tone={dark ? 'dark' : 'light'}
    />
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default async function LeadershipPage() {
  // Preserve transport failures for the route error boundary. Treating a
  // 429/5xx as [] made approved records look as though they were unpublished.
  const leaders = await apiClient.listLeadership();

  const seniorTeam = leaders.filter(l => SENIOR_ROLES.includes(l.role));
  const board = leaders.filter(l => BOARD_ROLES.includes(l.role));

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
            role: ROLE_LABEL[leader.role],
            bio: leader.bio || undefined,
            imageUrl: leader.imageUrl || undefined,
            path: '/leadership',
          })}
        />
      ))}

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <SiteHero
        backgroundImage="/Picflow/menleaders.webp"
        eyebrow="Leadership"
        title="The people who shepherd this church."
        subtitle="Called, committed, and accountable — meet the team that serves the Wisdom Church community."
      />

      {/* ── 2. Senior leadership ─────────────────────────────── */}
      <Section tone="dark">
        <Container>
          <SectionHeader
            eyebrow="Pastoral leadership"
            title="Shepherds of the"
            accent="Word and community."
            tone="dark"
          />

          {seniorTeam.length === 0 ? (
            <div className="mt-10">
              <EmptyState dark />
            </div>
          ) : (
            <div className="mt-10 grid gap-px bg-[var(--app-border)] sm:mt-12 lg:grid-cols-2">
              {seniorTeam.map((leader, i) => {
                const isTrailingOdd =
                  seniorTeam.length % 2 === 1 && i === seniorTeam.length - 1;
                return (
                  <ScrollFadeIn
                    key={leader.id}
                    delay={i * 0.07}
                    className={isTrailingOdd ? 'lg:col-span-2' : ''}
                  >
                    <LeaderCard leader={leader} tone="canvas" />
                  </ScrollFadeIn>
                );
              })}
            </div>
          )}
        </Container>
      </Section>

      {/* ── 3. Board of leaders — canvas ─────────────────────── */}
      {board.length > 0 && (
        <Section tone="canvas">
          <Container>
            <SectionHeader
              eyebrow="Board of leaders"
              title="Deacons & Deaconesses."
            />

            <div className="mt-10 divide-y divide-[var(--app-border)] border-y border-[var(--app-border)]">
              {board.map((leader, i) => (
                <ScrollFadeIn key={leader.id} delay={i * 0.035}>
                  <div className="grid items-center gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-10">
                    <div className="flex items-center gap-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--app-border)] bg-[var(--app-canvas-2)] font-ui text-label font-bold text-[var(--app-muted)]">
                        {initials(leader.firstName, leader.lastName)}
                      </div>
                      <div>
                        <p className="font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
                          {leader.firstName} {leader.lastName}
                        </p>
                        {leader.bio && (
                          <p className="mt-0.5 font-ui text-label text-[var(--app-subtle)] line-clamp-1">
                            {leader.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="self-start border border-[var(--app-border)] px-3 py-1 font-ui text-eyebrow uppercase tracking-[0.14em] text-[var(--app-muted)] sm:self-auto">
                      {ROLE_LABEL[leader.role]}
                    </span>
                  </div>
                </ScrollFadeIn>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── 4. CTA ───────────────────────────────────────────── */}
      <Section tone="dark">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="Serve with us"
            title="Leadership is an invitation,"
            accent="not just a title."
            description="If you feel called to serve the church in a meaningful way, we would love to have a conversation with you."
            tone="dark"
          />
          <div className="mt-8 flex justify-center">
            <CtaLink href="/contact" variant="outline">
              Get in touch
            </CtaLink>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
