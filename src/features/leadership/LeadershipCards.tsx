import type { LeadershipMember, LeadershipRole } from '@/lib/types';
import { Media } from '@/shared/ui/Media';

// Shared between /leadership (the full directory) and About's leadership
// spotlight — one definition of what a leader card looks like, so the two
// pages can never visually or structurally drift apart.

export const ROLE_LABEL: Record<LeadershipRole, string> = {
  senior_pastor: 'Senior Pastor',
  associate_pastor: 'Associate Pastor',
  deacon: 'Deacon',
  deaconess: 'Deaconess',
  reverend: 'Reverend',
};

export function initials(first = '', last = '') {
  return `${first.trim()[0] ?? ''}${last.trim()[0] ?? ''}`.toUpperCase() || '—';
}

/* ── Portrait card — canvas (light) ────────────────────── */

export function CanvasCard({ leader }: { leader: LeadershipMember }) {
  const name = `${leader.firstName} ${leader.lastName}`.trim();
  return (
    <article className="group flex flex-col bg-[var(--app-canvas)]">
      {/* Image */}
      <div className="relative h-[420px] overflow-hidden bg-[var(--app-canvas-2)] sm:h-[360px] lg:h-[480px]">
        <Media
          src={leader.imageUrl}
          alt={name}
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-[center_8%] transition duration-700 group-hover:scale-[1.025]"
          fallback={
            <span className="font-headline text-[7rem] font-normal leading-none text-[var(--app-ink)]/8">
              {initials(leader.firstName, leader.lastName)}
            </span>
          }
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--app-canvas)] to-transparent" />
      </div>
      {/* Content */}
      <div className="border-t border-[var(--app-ink)]/6 px-7 py-7 lg:px-10 lg:py-8">
        <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
          {ROLE_LABEL[leader.role]}
        </p>
        <h3 className="mt-2 font-headline text-heading-md font-normal leading-snug text-[var(--app-ink)]">
          {name}
        </h3>
        <div className="mt-3 h-[1.5px] w-8 bg-[var(--app-primary)]/50" />
        {leader.bio && (
          <p className="mt-4 font-ui text-body-sm leading-[1.9] text-[var(--app-ink)]/70">
            {leader.bio}
          </p>
        )}
      </div>
    </article>
  );
}

/* ── Portrait card — dark (cinematic) ──────────────────── */

export function DarkCard({ leader }: { leader: LeadershipMember }) {
  const name = `${leader.firstName} ${leader.lastName}`.trim();
  return (
    <article className="group relative min-h-[520px] overflow-hidden bg-[var(--app-dark)] lg:min-h-[580px]">
      <Media
        src={leader.imageUrl}
        alt={name}
        frameClassName="absolute inset-0 bg-[var(--app-dark)]"
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-[center_8%] transition duration-700 group-hover:scale-[1.025]"
        fallback={
          <span className="font-headline text-[7rem] font-normal leading-none text-white/[0.05]">
            {initials(leader.firstName, leader.lastName)}
          </span>
        }
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--app-dark)] via-[var(--app-dark)]/72 to-[var(--app-dark)]/12" />
      <div className="absolute inset-x-0 bottom-0 px-7 pb-9 pt-14 lg:px-10 lg:pb-11">
        <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
          {ROLE_LABEL[leader.role]}
        </p>
        <h3 className="mt-2 font-headline text-heading-md font-normal leading-snug text-white">
          {name}
        </h3>
        <div className="mt-3 h-[1.5px] w-8 bg-[var(--app-primary)]/60" />
        {leader.bio && (
          <p className="mt-4 font-ui text-body-sm leading-[1.9] text-white/68">
            {leader.bio}
          </p>
        )}
      </div>
    </article>
  );
}
