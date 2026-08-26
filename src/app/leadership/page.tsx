import SiteHero from '@/features/hero/SiteHero';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { apiClient } from '@/lib/api';
import type {
  LeadershipMember,
  LeadershipRole,
} from '@/domain/leadership/types';
import JsonLd from '@/shared/seo/JsonLd';
import { buildPersonSchema, buildBreadcrumbSchema } from '@/lib/seo';
import {
  CanvasCard,
  DarkCard,
  ROLE_LABEL,
  initials,
} from '@/features/leadership/LeadershipCards';
import {
  EditorialContainer,
  EditorialPage,
  EditorialEmptyState,
  EditorialHeader,
  EditorialLink,
  EditorialSection,
} from '@/shared/ui/editorial';

const SENIOR_ROLES: LeadershipRole[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
];
const BOARD_ROLES: LeadershipRole[] = ['deacon', 'deaconess'];

/* ── Empty state ────────────────────────────────────────── */

function EmptyState({ dark }: { dark?: boolean }) {
  return (
    <EditorialEmptyState
      title="Leadership listings coming soon."
      description="Our leadership directory will be published here shortly."
      tone={dark ? 'dark' : 'light'}
    />
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default async function LeadershipPage() {
  const leaders = await apiClient
    .listLeadership()
    .catch(() => [] as LeadershipMember[]);

  const seniorTeam = leaders.filter(l => SENIOR_ROLES.includes(l.role));
  const board = leaders.filter(l => BOARD_ROLES.includes(l.role));

  return (
    <EditorialPage>
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
        compact
      />

      <EditorialSection tone="dark" compact>
        <EditorialContainer>
          <EditorialHeader
            eyebrow="Pastoral leadership"
            title="Shepherds of the"
            accent="Word and community."
            tone="dark"
          />
        </EditorialContainer>
      </EditorialSection>

      {/* ── 3. Senior portrait panels ────────────────────────── */}
      {seniorTeam.length === 0 ? (
        <div className="relative bg-[var(--app-dark)] px-6 py-10 lg:px-10">
          <EditorialContainer>
            <EmptyState dark />
          </EditorialContainer>
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
        <EditorialSection tone="canvas">
          <EditorialContainer>
            <EditorialHeader
              eyebrow="Board of leaders"
              title="Deacons & Deaconesses."
            />
          </EditorialContainer>

          {/* Name list — editorial rows */}
          <div className="divide-y divide-[var(--app-ink)]/8 border-t border-[var(--app-ink)]/8">
            {board.map((leader, i) => (
              <ScrollFadeIn key={leader.id} delay={i * 0.035}>
                <div
                  className={`${i % 2 === 0 ? 'bg-[var(--app-canvas)]' : 'bg-[var(--app-canvas-2)]'}`}
                >
                  <EditorialContainer>
                    <div className="grid items-center gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-10">
                      <div className="flex items-center gap-5">
                        {/* Initials badge */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--app-ink)]/10 bg-[var(--app-canvas-2)] font-ui text-label font-bold text-[var(--app-ink)]/60">
                          {initials(leader.firstName, leader.lastName)}
                        </div>
                        <div>
                          <p className="font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
                            {leader.firstName} {leader.lastName}
                          </p>
                          {leader.bio && (
                            <p className="mt-0.5 font-ui text-label text-[var(--app-ink)]/55 line-clamp-1">
                              {leader.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="self-start border border-[var(--app-ink)]/10 px-3 py-1 font-ui text-eyebrow uppercase tracking-[0.14em] text-[var(--app-ink)]/60 sm:self-auto">
                        {ROLE_LABEL[leader.role]}
                      </span>
                    </div>
                  </EditorialContainer>
                </div>
              </ScrollFadeIn>
            ))}
          </div>

          <div className="pb-12 lg:pb-16" />
        </EditorialSection>
      )}

      {/* ── 5. CTA ───────────────────────────────────────────── */}
      <EditorialSection tone="dark">
        <EditorialContainer>
          <div className="mx-auto max-w-3xl text-center">
            <EditorialHeader
              eyebrow="Serve with us"
              title="Leadership is an invitation,"
              accent="not just a title."
              description="If you feel called to serve the church in a meaningful way, we would love to have a conversation with you."
              tone="dark"
            />
            <EditorialLink href="/contact" variant="outline" className="mt-8">
              Get in touch
            </EditorialLink>
          </div>
        </EditorialContainer>
      </EditorialSection>
    </EditorialPage>
  );
}
