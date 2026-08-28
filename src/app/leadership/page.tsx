import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { apiClient } from '@/lib/api';
import type { LeadershipRole } from '@/domain/leadership/types';
import JsonLd from '@/shared/seo/JsonLd';
import { buildPersonSchema, buildBreadcrumbSchema } from '@/lib/seo';
import {
  CanvasCard,
  DarkCard,
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
        eyebrow="Leadership"
        title="The people who shepherd this church."
        subtitle="Called, committed, and accountable — meet the team that serves the Wisdom Church community."
      />

      <Section tone="dark" compact>
        <Container>
          <SectionHeader
            eyebrow="Pastoral leadership"
            title="Shepherds of the"
            accent="Word and community."
            tone="dark"
          />
        </Container>
      </Section>

      {/* ── 3. Senior portrait panels ────────────────────────── */}
      {seniorTeam.length === 0 ? (
        <div className="tone-dark relative bg-[var(--app-dark)] px-6 py-10 lg:px-10">
          <Container>
            <EmptyState dark />
          </Container>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2">
          {seniorTeam.map((leader, i) => {
            // A lone trailing card (odd total) is centered at its normal
            // half-width instead of stretched full-width — these cards use
            // a fixed aspect ratio sized for a half column, so stretching
            // would distort the portrait rather than just filling space.
            const isTrailingOdd =
              seniorTeam.length % 2 === 1 && i === seniorTeam.length - 1;

            return (
              <ScrollFadeIn
                key={leader.id}
                delay={i * 0.07}
                className={isTrailingOdd ? 'sm:col-span-2' : ''}
              >
                <div className={isTrailingOdd ? 'sm:mx-auto sm:w-1/2' : ''}>
                  {i % 2 === 0 ? (
                    <CanvasCard leader={leader} />
                  ) : (
                    <DarkCard leader={leader} />
                  )}
                </div>
              </ScrollFadeIn>
            );
          })}
        </div>
      )}

      {/* ── 4. Board header — canvas ─────────────────────────── */}
      {board.length > 0 && (
        <Section tone="canvas">
          <Container>
            <SectionHeader
              eyebrow="Board of leaders"
              title="Deacons & Deaconesses."
            />
          </Container>

          {/* Name list — editorial rows */}
          <div className="divide-y divide-[var(--app-border)] border-t border-[var(--app-border)]">
            {board.map((leader, i) => (
              <ScrollFadeIn key={leader.id} delay={i * 0.035}>
                <div
                  className={`${i % 2 === 0 ? 'bg-[var(--app-canvas)]' : 'bg-[var(--app-canvas-2)]'}`}
                >
                  <Container>
                    <div className="grid items-center gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-10">
                      <div className="flex items-center gap-5">
                        {/* Initials badge */}
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
                  </Container>
                </div>
              </ScrollFadeIn>
            ))}
          </div>

          <div className="pb-12 lg:pb-16" />
        </Section>
      )}

      {/* ── 5. CTA ───────────────────────────────────────────── */}
      <Section tone="dark">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader
              eyebrow="Serve with us"
              title="Leadership is an invitation,"
              accent="not just a title."
              description="If you feel called to serve the church in a meaningful way, we would love to have a conversation with you."
              tone="dark"
            />
            <CtaLink href="/contact" variant="outline" className="mt-8">
              Get in touch
            </CtaLink>
          </div>
        </Container>
      </Section>
    </Page>
  );
}
