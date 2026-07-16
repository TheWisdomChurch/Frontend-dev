import Image from 'next/image';
import Link from 'next/link';

import PageHero from '@/features/hero/PageHero';
import { Container } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';
import { IMAGE_QUALITY } from '@/shared/constants';

/* ── Utilities ──────────────────────────────────────────── */

function getTimestamp(event: EventPublic): number {
  if (event.startAt) {
    const t = new Date(event.startAt).getTime();
    if (!Number.isNaN(t)) return t;
  }
  if (event.date) {
    const t = new Date(`${event.date}T${event.time ?? '00:00'}`).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return Number.MAX_SAFE_INTEGER;
}

function formatDate(event: EventPublic): {
  month: string;
  day: string;
  full: string;
} {
  const t = getTimestamp(event);
  if (t === Number.MAX_SAFE_INTEGER || (!event.startAt && !event.date)) {
    return { month: '—', day: '—', full: 'Date to be announced' };
  }
  const d = new Date(t);
  return {
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()),
    full: d.toLocaleString('en', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}

function formatTime(event: EventPublic): string {
  if (event.startAt) {
    const d = new Date(event.startAt);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString('en', { hour: '2-digit', minute: '2-digit' });
    }
  }
  return event.time ?? '';
}

function registerHref(event: EventPublic): string | null {
  if (event.registerLink) return event.registerLink;
  if (event.formSlug) return `/forms/${event.formSlug}`;
  return null;
}

/* ── Static weekly data ─────────────────────────────────── */

const WEEKLY = [
  {
    day: 'Sunday',
    time: '9:00 AM',
    name: 'Sunday Worship Service',
    description:
      'Spirit-filled corporate worship, prayer, and the preached Word.',
  },
  {
    day: 'Mon – Fri',
    time: '7:00 AM',
    name: 'Daily Morning Prayer',
    description: 'Start the day in prayer, declaration, and the Word.',
  },
] as const;

/* ── Arrow ──────────────────────────────────────────────── */

function Arrow() {
  return (
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
  );
}

/* ── Event card ─────────────────────────────────────────── */

function EventCard({ event }: { event: EventPublic }) {
  const date = formatDate(event);
  const time = formatTime(event);
  const href = registerHref(event);
  const imgSrc = event.bannerUrl ?? event.imageUrl ?? null;

  return (
    <article className="group flex flex-col overflow-hidden border border-white/10 bg-white/[0.03] transition duration-300 hover:border-[var(--app-primary)]/35">
      {/* Image / date block */}
      <div className="relative aspect-[2/1] overflow-hidden bg-[var(--app-dark-2)]">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={IMAGE_QUALITY}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          /* No-image: bold date display */
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              {date.month}
            </span>
            <span className="font-headline text-[3.5rem] font-normal leading-none text-white/90">
              {date.day}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-dark)]/70 via-transparent to-transparent" />

        {/* Date badge — only when there's an image */}
        {imgSrc && (
          <div className="absolute bottom-3 left-4 flex items-baseline gap-2">
            <span className="font-headline text-[1.8rem] font-normal leading-none text-white">
              {date.day}
            </span>
            <span className="font-ui text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]">
              {date.month}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5 pt-4">
        <h3 className="font-headline text-[1.1rem] font-normal leading-snug text-white line-clamp-2 transition duration-200 group-hover:text-[var(--app-primary)]/90">
          {event.title}
        </h3>

        {event.description && (
          <p className="font-ui text-[0.8rem] leading-[1.8] text-white/65 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="mt-auto space-y-1.5 border-t border-white/8 pt-4">
          {time && (
            <p className="font-ui text-[0.75rem] font-semibold text-white/55">
              {date.full} · {time}
            </p>
          )}
          {event.location && (
            <p className="font-ui text-[0.75rem] text-white/38 line-clamp-1">
              {event.location}
            </p>
          )}
        </div>

        {href ? (
          <a
            href={href}
            className="mt-2 inline-flex items-center gap-2 self-start border border-[var(--app-primary)]/40 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-[var(--app-primary)] transition duration-150 hover:bg-[var(--app-primary)] hover:text-[var(--app-ink)]"
          >
            Register <Arrow />
          </a>
        ) : (
          <span className="mt-2 inline-flex items-center gap-2 self-start border border-white/12 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-white/35">
            Free entry
          </span>
        )}
      </div>
    </article>
  );
}

/* ── Empty state ────────────────────────────────────────── */

function EmptyState() {
  return (
    <ScrollFadeIn>
      <div className="flex flex-col items-center gap-6 border border-white/8 bg-white/[0.025] px-8 py-16 text-center">
        <div className="h-[1.5px] w-10 bg-[var(--app-primary)]/50" />
        <h3 className="font-headline text-[1.5rem] font-normal text-white">
          Events are on their way.
        </h3>
        <p className="max-w-sm font-ui text-[0.83rem] leading-[1.85] text-white/65">
          Nothing is scheduled right now. In the meantime, join us for Sunday
          Worship and Daily Prayer, Monday through Friday.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 border border-white/18 px-6 py-2.5 font-ui text-[0.72rem] font-semibold text-white/55 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
        >
          Plan a visit <Arrow />
        </Link>
      </div>
    </ScrollFadeIn>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default async function EventsPage() {
  const rawEvents = await apiClient
    .listEvents()
    .catch(() => [] as EventPublic[]);
  const events = [...rawEvents].sort(
    (a, b) => getTimestamp(a) - getTimestamp(b)
  );

  return (
    <main className="min-h-screen">
      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <PageHero
        eyebrow="Events & Programs"
        title="What's happening at Wisdom Church."
        subtitle="Weekly services, special gatherings, and everything in between."
        compact
      />

      {/* ── 2. Weekly rhythm — canvas, always present ────────── */}
      <section className="overflow-hidden min-w-0 border-b border-[var(--app-ink)]/8 bg-[var(--app-canvas)]">
        <Container size="xl">
          <ScrollFadeIn className="py-12 lg:py-16">
            <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Weekly rhythm
            </p>
            <h2 className="mt-3 font-headline text-[1.7rem] font-normal leading-snug text-[var(--app-ink)] sm:text-[2.1rem]">
              We gather every week.
              <em className="italic text-[var(--app-primary)]/75">
                {' '}
                Come as you are.
              </em>
            </h2>
          </ScrollFadeIn>

          {/* Two service panels */}
          <div className="grid border-t border-[var(--app-ink)]/8 sm:grid-cols-2 sm:divide-x sm:divide-[var(--app-ink)]/8">
            {WEEKLY.map((svc, i) => (
              <ScrollFadeIn key={svc.day} delay={i * 0.09}>
                <div
                  className={`flex flex-col gap-5 p-8 lg:p-10 ${i === 0 ? '' : 'border-t border-[var(--app-ink)]/8 sm:border-t-0'}`}
                >
                  {/* Day + time */}
                  <div className="flex items-baseline gap-4">
                    <p className="font-headline text-[2.2rem] font-normal leading-none text-[var(--app-ink)] lg:text-[2.6rem]">
                      {svc.day}
                    </p>
                    <p className="font-ui text-[0.88rem] font-bold text-[var(--app-primary)]">
                      {svc.time}
                    </p>
                  </div>

                  {/* Gold rule */}
                  <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />

                  {/* Service info */}
                  <div className="space-y-1.5">
                    <p className="font-headline text-[1.1rem] font-normal text-[var(--app-ink)]">
                      {svc.name}
                    </p>
                    <p className="font-ui text-[0.8rem] leading-[1.8] text-[var(--app-ink)]/65">
                      {svc.description}
                    </p>
                    <p className="font-ui text-[0.75rem] text-[var(--app-ink)]/50">
                      Honor Gardens, Lekki-Epe Expressway, Lagos
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/contact"
                    className="mt-1 inline-flex items-center gap-2 self-start border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-[0.7rem] font-semibold text-[var(--app-ink)]/50 transition duration-150 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
                  >
                    Plan a visit <Arrow />
                  </Link>
                </div>
              </ScrollFadeIn>
            ))}
          </div>

          {/* Bottom padding spacer */}
          <div className="pb-12 lg:pb-16" />
        </Container>
      </section>

      {/* ── 3. Upcoming events — dark, API-driven ────────────── */}
      <section className="overflow-hidden min-w-0 bg-[var(--app-dark)] py-16 lg:py-20">
        <Container size="xl">
          {/* Header */}
          <ScrollFadeIn className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                Upcoming events
              </p>
              <h2 className="mt-3 font-headline text-[1.7rem] font-normal leading-snug text-white sm:text-[2.1rem]">
                Special gatherings &amp; programs.
              </h2>
            </div>
            {events.length > 0 && (
              <span className="inline-flex items-center self-start border border-white/12 px-4 py-2 font-ui text-[0.72rem] font-semibold text-white/45 sm:self-auto">
                {events.length} event{events.length !== 1 ? 's' : ''}
              </span>
            )}
          </ScrollFadeIn>

          {/* Content */}
          {events.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <ScrollFadeIn key={event.id} delay={i * 0.05}>
                  <EventCard event={event} />
                </ScrollFadeIn>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── 4. CTA strip ─────────────────────────────────────── */}
      <ScrollFadeIn>
        <section className="overflow-hidden min-w-0 border-t border-white/8 bg-[var(--app-dark-2)] py-10">
          <Container size="xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-headline text-[1.2rem] font-normal text-white">
                  Have a question about an event?
                </p>
                <p className="mt-1 font-ui text-[0.8rem] text-white/55">
                  Our team is happy to help — reach out any time.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 border border-white/20 px-6 py-3 font-ui text-[0.72rem] font-semibold text-white/60 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              >
                Contact us <Arrow />
              </Link>
            </div>
          </Container>
        </section>
      </ScrollFadeIn>
    </main>
  );
}
