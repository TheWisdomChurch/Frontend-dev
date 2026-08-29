import type {
  LeadershipMember,
  LeadershipRole,
} from '@/domain/leadership/types';
import { Media } from '@/shared/ui/Media';
import { Eyebrow } from '@/shared/ui/layout';

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

/* ── Leader card ───────────────────────────────────────────
   One layout, two tones. Compact horizontal card (image beside
   the text) through tablet so a portrait never balloons to the
   full viewport width; full-bleed vertical portrait from lg up. */

type LeaderCardProps = { leader: LeadershipMember; tone?: 'canvas' | 'dark' };

export function LeaderCard({ leader, tone = 'canvas' }: LeaderCardProps) {
  const name = `${leader.firstName} ${leader.lastName}`.trim();
  const dark = tone === 'dark';

  return (
    <article
      className={[
        'group flex h-full min-h-[190px] flex-row overflow-hidden lg:min-h-0 lg:flex-col',
        dark ? 'tone-dark bg-[var(--app-dark)]' : 'bg-[var(--app-canvas)]',
      ].join(' ')}
    >
      {/* Image */}
      <div className="relative w-[38%] shrink-0 self-stretch overflow-hidden bg-[var(--app-canvas-2)] sm:w-[34%] lg:aspect-[4/5] lg:w-full">
        <Media
          src={leader.imageUrl}
          alt={name}
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 34vw, 40vw"
          className="object-top transition duration-700 group-hover:scale-[1.03]"
          fallback={
            <span className="font-headline text-display-md font-normal leading-none text-[var(--app-border)] lg:text-display-xl">
              {initials(leader.firstName, leader.lastName)}
            </span>
          }
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-16 bg-gradient-to-t from-[var(--app-canvas)] to-transparent lg:block" />
      </div>

      {/* Content */}
      <div
        className={[
          'flex flex-1 flex-col justify-center px-5 py-5 sm:px-7 sm:py-7 lg:justify-start lg:border-t lg:border-[var(--app-border)] lg:px-9 lg:py-8',
        ].join(' ')}
      >
        <Eyebrow>{ROLE_LABEL[leader.role]}</Eyebrow>
        <h3 className="mt-2 font-headline text-heading-sm font-normal leading-snug text-current lg:text-heading-md">
          {name}
        </h3>
        <div className="mt-3 h-[1.5px] w-8 bg-[var(--app-primary)]/50" />
        {leader.bio && (
          <p className="mt-3 font-ui text-body-sm leading-[1.8] text-[var(--app-muted)] line-clamp-4 sm:mt-4 sm:leading-[1.9] lg:line-clamp-none">
            {leader.bio}
          </p>
        )}
      </div>
    </article>
  );
}

/* Back-compat named exports — the two pages import these directly. */

export function CanvasCard({ leader }: { leader: LeadershipMember }) {
  return <LeaderCard leader={leader} tone="canvas" />;
}

export function DarkCard({ leader }: { leader: LeadershipMember }) {
  return <LeaderCard leader={leader} tone="dark" />;
}
