'use client';

import type { LeadershipMember } from '@/domain/leadership/types';
import { formatLeadershipRole } from '@/domain/leadership/types';
import { Media } from '@/shared/ui/Media';
import { cn } from '@/lib/cn';
import { ArrowRight } from 'lucide-react';

// Shared between /leadership (the full directory) and About's leadership
// spotlight — one definition of what a leader card looks like, so the two
// pages can never visually or structurally drift apart.

export function initials(first = '', last = '') {
  return `${first.trim()[0] ?? ''}${last.trim()[0] ?? ''}`.toUpperCase() || '—';
}

/* ── Modern Leader Card ──────────────────────────────────────
   Luxury editorial card with balanced proportions, crystal clear
   imagery, elegant gold role tags, and an accessible "Read bio" trigger. */

export type LeaderCardProps = {
  leader: LeadershipMember;
  tone?: 'canvas' | 'dark';
  onOpenBio?: (leader: LeadershipMember) => void;
};

export function LeaderCard({
  leader,
  tone = 'dark',
  onOpenBio,
}: LeaderCardProps) {
  const name = `${leader.firstName} ${leader.lastName}`.trim();
  const role = formatLeadershipRole(leader.role);
  const isDark = tone === 'dark';
  const hasBio = Boolean(leader.bio && leader.bio.trim().length > 0);

  const handleCardClick = () => {
    if (hasBio && onOpenBio) {
      onOpenBio(leader);
    }
  };

  return (
    <article
      tabIndex={hasBio && onOpenBio ? 0 : undefined}
      role={hasBio && onOpenBio ? 'button' : undefined}
      aria-label={
        hasBio && onOpenBio ? `View biography for ${name}` : undefined
      }
      onClick={handleCardClick}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && hasBio && onOpenBio) {
          e.preventDefault();
          onOpenBio(leader);
        }
      }}
      className={cn(
        'group relative isolate flex flex-col aspect-[3/3.7] overflow-hidden rounded-card',
        'border transition-all duration-500 ease-out',
        'motion-safe:hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]',
        isDark
          ? 'border-white/10 bg-[var(--app-dark-2)] shadow-xl hover:border-[color-mix(in_srgb,var(--app-primary)_60%,transparent)] hover:shadow-[0_24px_54px_color-mix(in_srgb,var(--app-primary)_16%,transparent)]'
          : 'border-[var(--app-border)] bg-[var(--app-surface)] shadow-md hover:border-[var(--app-primary)] hover:shadow-xl',
        hasBio && onOpenBio && 'cursor-pointer'
      )}
    >
      {/* Department / Category Pill (top-left) */}
      {leader.department ? (
        <div className="absolute left-4 top-4 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-ui text-caption font-semibold uppercase tracking-wider text-white backdrop-blur-md shadow-sm">
            {leader.department}
          </span>
        </div>
      ) : null}

      {/* Leader Image */}
      <Media
        src={leader.imageUrl}
        alt={name}
        sizes="(max-width: 640px) 94vw, (max-width: 1024px) 46vw, 31vw"
        className="object-cover object-center transition-transform duration-700 ease-out will-change-transform motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none"
        fallback={
          <div className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(155deg,var(--app-dark-3),var(--app-dark-2))]">
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_36%,color-mix(in_srgb,var(--app-primary)_20%,transparent),transparent_70%)]"
            />
            <span className="relative font-headline text-[clamp(2.5rem,8vw,4.5rem)] font-light leading-none tracking-[0.02em] text-[color-mix(in_srgb,var(--app-primary)_75%,transparent)]">
              {initials(leader.firstName, leader.lastName)}
            </span>
          </div>
        }
      />

      {/* Refined directional lighting scrim: natural face lighting, high contrast at the base */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--app-dark)_96%,transparent)_0%,color-mix(in_srgb,var(--app-dark)_65%,transparent)_42%,color-mix(in_srgb,var(--app-dark)_15%,transparent)_70%,transparent_100%)] transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Leader Information Content */}
      <div className="relative z-10 mt-auto flex flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-[var(--app-primary)]" />
          <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-primary-light)] [text-shadow:0_1px_8px_black]">
            {role}
          </p>
        </div>

        <h3 className="mt-1 font-headline text-heading-md font-normal leading-snug text-white [text-shadow:0_2px_12px_black]">
          {name}
        </h3>

        {/* Short Teaser / Read Bio Action */}
        {hasBio ? (
          <div className="mt-2.5">
            <p className="line-clamp-2 font-ui text-body-sm leading-relaxed text-white/80 [text-shadow:0_1px_8px_black]">
              {leader.bio}
            </p>

            {onOpenBio ? (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onOpenBio(leader);
                }}
                className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--app-primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_12%,transparent)] px-4 py-1.5 font-ui text-caption font-bold uppercase tracking-wider text-[var(--app-primary-light)] backdrop-blur-sm transition-all duration-200 hover:border-[var(--app-primary)] hover:bg-[var(--app-primary)] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                aria-label={`Read full biography for ${name}`}
              >
                <span>Read bio</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* Back-compat named exports — used by About page and other areas. */

export function CanvasCard({ leader }: { leader: LeadershipMember }) {
  return <LeaderCard leader={leader} tone="canvas" />;
}

export function DarkCard({ leader }: { leader: LeadershipMember }) {
  return <LeaderCard leader={leader} tone="dark" />;
}
