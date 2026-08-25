import SiteHero from '@/features/hero/SiteHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import SectionGlow from '@/shared/ui/SectionGlow';
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

const SENIOR_ROLES: LeadershipRole[] = [
  'senior_pastor',
  'associate_pastor',
  'reverend',
];
const BOARD_ROLES: LeadershipRole[] = ['deacon', 'deaconess'];

/* ── Empty state ────────────────────────────────────────── */

function EmptyState({ dark }: { dark?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center gap-5 border px-8 py-16 text-center ${dark ? 'border-white/8 bg-white/[0.025]' : 'border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)]'}`}
    >
      <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />
      <p
        className={`font-headline text-heading-sm font-normal ${dark ? 'text-white' : 'text-[var(--app-ink)]'}`}
      >
        Leadership listings coming soon.
      </p>
      <p
        className={`max-w-sm font-ui text-body-sm leading-[1.85] ${dark ? 'text-white/65' : 'text-[var(--app-ink)]/65'}`}
      >
        Our leadership directory will be published here shortly.
      </p>
    </div>
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
    <main className="min-h-screen">
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

      {/* ── 2. Senior leadership header — dark ───────────────── */}
      <section className="relative overflow-hidden min-w-0 border-b border-white/8 bg-[var(--app-dark)] px-6 py-14 lg:px-10 lg:py-18">
        <SectionGlow />
        <Container size="xl">
          <ScrollFadeIn className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-lg">
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Pastoral leadership
              </p>
              <h2 className="mt-3 font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-lg">
                Shepherds of the
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  Word and community.
                </em>
              </h2>
            </div>
          </ScrollFadeIn>
        </Container>
      </section>

      {/* ── 3. Senior portrait panels ────────────────────────── */}
      {seniorTeam.length === 0 ? (
        <div className="relative bg-[var(--app-dark)] px-6 py-10 lg:px-10">
          <SectionGlow />
          <Container size="xl">
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
        <section className="overflow-hidden min-w-0 border-y border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
          <Container size="xl">
            <ScrollFadeIn className="py-12 lg:py-14">
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Board of leaders
              </p>
              <h2 className="mt-3 font-headline text-heading-md font-normal leading-snug text-[var(--app-ink)] sm:text-heading-lg">
                Deacons &amp; Deaconesses.
              </h2>
            </ScrollFadeIn>
          </Container>

          {/* Name list — editorial rows */}
          <div className="divide-y divide-[var(--app-ink)]/8 border-t border-[var(--app-ink)]/8">
            {board.map((leader, i) => (
              <ScrollFadeIn key={leader.id} delay={i * 0.035}>
                <div
                  className={`${i % 2 === 0 ? 'bg-[var(--app-canvas)]' : 'bg-[var(--app-canvas-2)]'}`}
                >
                  <Container size="xl">
                    <div className="grid items-center gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-10">
                      <div className="flex items-center gap-5">
                        {/* Initials badge */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--app-ink)]/10 bg-[var(--app-canvas-2)] font-ui text-label font-bold text-[var(--app-ink)]/60">
                          {initials(leader.firstName, leader.lastName)}
                        </div>
                        <div>
                          <p className="font-headline text-heading-sm font-normal text-[var(--app-ink)]">
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
                  </Container>
                </div>
              </ScrollFadeIn>
            ))}
          </div>

          <div className="pb-12 lg:pb-16" />
        </section>
      )}

      {/* ── 5. CTA ───────────────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="relative overflow-hidden min-w-0 bg-[var(--app-dark)] py-20 lg:py-24">
          <SectionGlow />
          <Container size="lg">
            <div className="flex flex-col items-center gap-7 text-center">
              <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Serve with us
              </p>
              <h2 className="font-headline text-heading-md font-normal leading-snug text-white sm:text-heading-lg">
                Leadership is an invitation,
                <em className="italic text-[var(--app-primary)]/80">
                  {' '}
                  not just a title.
                </em>
              </h2>
              <div className="h-px w-10 bg-[var(--app-primary)]/40" />
              <p className="max-w-md font-ui text-body-sm leading-[1.9] text-white/70">
                If you feel called to serve the church in a meaningful way, we
                would love to have a conversation with you.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 font-ui text-label font-semibold uppercase tracking-[0.12em] text-white/60 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              >
                Get in touch
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 6h10M6 1l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
