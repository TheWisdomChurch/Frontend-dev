import type {
  LeadershipMember,
  LeadershipRole,
} from '@/domain/leadership/types';
import { Media } from '@/shared/ui/Media';
import { cn } from '@/lib/cn';

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
   Image-forward: the portrait fills the frame edge to edge.
   Role + name rest over a soft gradient; on hover (and always
   on touch devices) a slim gold rule and the bio slide open.
   A missing photo resolves to a gilded monogram, never a
   broken frame. */

type LeaderCardProps = { leader: LeadershipMember; tone?: 'canvas' | 'dark' };

export function LeaderCard({ leader }: LeaderCardProps) {
  const name = `${leader.firstName} ${leader.lastName}`.trim();
  const role = ROLE_LABEL[leader.role];

  return (
    <article
      className={cn(
        'group relative isolate aspect-[4/5] overflow-hidden rounded-card bg-[var(--app-dark-2)]',
        'ring-1 ring-inset ring-[color-mix(in_srgb,white_12%,transparent)]',
        'transition-[transform,box-shadow] duration-500 ease-out',
        'motion-safe:hover:-translate-y-1.5 hover:shadow-[0_30px_64px_color-mix(in_srgb,black_32%,transparent)]',
        'hover:ring-[color-mix(in_srgb,var(--app-primary)_50%,transparent)]'
      )}
    >
      <Media
        src={leader.imageUrl}
        alt={name}
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
        className="object-center transition-transform duration-[900ms] ease-out will-change-transform motion-safe:group-hover:scale-[1.05] motion-reduce:transition-none"
        fallback={
          <div className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(155deg,var(--app-dark-3),var(--app-dark-2))]">
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_36%,color-mix(in_srgb,var(--app-primary)_22%,transparent),transparent_70%)]"
            />
            <span className="relative font-headline text-[clamp(3rem,10vw,5.5rem)] font-normal leading-none tracking-[0.02em] text-[color-mix(in_srgb,var(--app-primary)_72%,transparent)]">
              {initials(leader.firstName, leader.lastName)}
            </span>
          </div>
        }
      />

      {/* Legibility wash — deep at the foot, clear at the top. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--app-dark)_92%,transparent),color-mix(in_srgb,var(--app-dark)_34%,transparent)_46%,transparent_72%)] transition-opacity duration-500 group-hover:opacity-100 md:opacity-90"
      />

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary-light)] [text-shadow:0_1px_10px_black]">
          {role}
        </p>
        <h3 className="mt-1.5 font-headline text-heading-md font-normal leading-tight text-white [text-shadow:0_2px_16px_black]">
          {name}
        </h3>

        {leader.bio ? (
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <span className="mt-3 block h-px w-10 bg-[color-mix(in_srgb,var(--app-primary)_75%,transparent)]" />
              <p className="mt-3 line-clamp-4 font-ui text-body-sm leading-[1.7] text-white/85 [text-shadow:0_1px_12px_black]">
                {leader.bio}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* Back-compat named exports — the two pages import these directly. */

export function CanvasCard({ leader }: { leader: LeadershipMember }) {
  return <LeaderCard leader={leader} />;
}

export function DarkCard({ leader }: { leader: LeadershipMember }) {
  return <LeaderCard leader={leader} />;
}
