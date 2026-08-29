import type {
  LeadershipMember,
  LeadershipRole,
} from '@/domain/leadership/types';
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

/* ── Leader card ───────────────────────────────────────────
   One editorial portrait card, two tones. A framed 4:5 photo
   sits above a captioned block: role eyebrow, name, a gold
   hairline, and the bio. Missing photos resolve to a tinted
   monogram — never a broken frame. */

type LeaderCardProps = { leader: LeadershipMember; tone?: 'canvas' | 'dark' };

export function LeaderCard({ leader, tone = 'canvas' }: LeaderCardProps) {
  const name = `${leader.firstName} ${leader.lastName}`.trim();
  const dark = tone === 'dark';

  return (
    <article
      className={[
        'group relative flex h-full flex-col overflow-hidden rounded-card border transition-[transform,border-color,box-shadow] duration-500 ease-out',
        'motion-safe:hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20',
        dark
          ? 'tone-dark border-[var(--app-border)] bg-[var(--app-dark-2)] hover:border-[color-mix(in_srgb,var(--app-primary)_45%,transparent)]'
          : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[color-mix(in_srgb,var(--app-primary)_45%,transparent)]',
      ].join(' ')}
    >
      {/* Portrait */}
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-[var(--app-canvas-2)]">
        <Media
          src={leader.imageUrl}
          alt={name}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-top transition duration-700 ease-out group-hover:scale-[1.04]"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(150deg,var(--app-canvas-2),var(--app-canvas-3))]">
              <span className="font-headline text-display-lg font-normal leading-none text-[color-mix(in_srgb,var(--app-primary)_60%,transparent)]">
                {initials(leader.firstName, leader.lastName)}
              </span>
            </div>
          }
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--app-dark)_55%,transparent),transparent)]" />
      </div>

      {/* Caption */}
      <div className="flex flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7">
        <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">
          {ROLE_LABEL[leader.role]}
        </p>
        <h3 className="mt-2.5 font-headline text-heading-md font-normal leading-tight text-[var(--app-ink)]">
          {name}
        </h3>
        <div className="mt-3.5 h-px w-10 bg-[color-mix(in_srgb,var(--app-primary)_55%,transparent)]" />
        {leader.bio && (
          <p className="mt-4 font-ui text-body-sm leading-[1.85] text-[var(--app-muted)] line-clamp-4">
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
