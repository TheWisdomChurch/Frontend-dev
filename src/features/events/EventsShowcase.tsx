'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, MapPin } from 'lucide-react';

import { hero_bg_1, hero_bg_3, EventBannerDesktop } from '@/shared/assets';
import { Container, Section } from '@/shared/layout';
import { apiClient } from '@/lib/api';
import type { EventPublic } from '@/lib/apiTypes';

import { AnimatePresence, motion } from '@/lib/safe-motion';
import { BaseModal } from '@/shared/ui/modals/Base';
import { Play } from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */

type ShowcaseCategory = 'program' | 'media' | 'reel';

type Slide = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  cta: string;
  href?: string;
  badge: string;
  category: ShowcaseCategory;
  start?: string;
  end?: string;
  videoUrl?: string;
};

const STATIC_SLIDES: Slide[] = [
  {
    id: 'media-stories',
    title: 'Media Stories',
    description:
      'Short testimonies, sermon clips, and behind-the-scenes moments.',
    date: 'Updated weekly',
    location: 'Content Hub',
    imageUrl: hero_bg_1.src,
    cta: 'View media',
    href: '/resources',
    badge: 'Media',
    category: 'media',
  },
  {
    id: 'highlights-reels',
    title: 'Highlights & Reels',
    description: 'Watch quick reels from recent services and events.',
    date: 'Updated weekly',
    location: 'Media Team',
    imageUrl: hero_bg_3.src,
    cta: 'Watch reels',
    href: '/resources/sermons',
    badge: 'Reel',
    category: 'reel',
  },
];

const CATEGORY_LABELS: Record<ShowcaseCategory, string> = {
  program: 'Programs',
  media: 'Media',
  reel: 'Reels',
};

function formatDate(startAt?: string): string {
  if (!startAt) return 'Date TBA';
  const d = new Date(startAt);
  if (Number.isNaN(d.getTime())) return 'Date TBA';
  return d
    .toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
    .toUpperCase();
}

function statusBadge(startAt?: string, endAt?: string): string {
  if (!startAt) return 'Upcoming';
  const start = new Date(startAt).getTime();
  const end = endAt ? new Date(endAt).getTime() : start;
  const now = Date.now();
  if (now >= start && now <= end) return 'Happening now';
  if (now < start) return 'Upcoming';
  return 'Recent';
}

/* ─────────────────────────────────────────────────────────
   Event card
───────────────────────────────────────────────────────── */

function EventCard({
  slide,
  featured = false,
}: {
  slide: Slide;
  featured?: boolean;
}) {
  const isReel = slide.category === 'reel';

  if (featured) {
    // Horizontal layout for first card
    return (
      <div className="group relative flex min-h-[280px] overflow-hidden rounded-[var(--radius-card)] bg-[var(--app-ink)] lg:min-h-[340px]">
        {/* Image */}
        <div className="relative w-[52%] shrink-0 overflow-hidden">
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--app-ink)]/30" />
          {isReel && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl transition duration-200 group-hover:scale-[1.08]">
                <Play className="h-5 w-5 fill-black text-black" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-7 lg:p-9">
          <div>
            <span className="font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              {slide.badge} · Featured
            </span>
            <p className="mt-4 font-headline text-[1.5rem] font-normal leading-snug text-white lg:text-[1.75rem]">
              {slide.title}
            </p>
            <p className="mt-3 line-clamp-3 font-body text-[0.83rem] leading-[1.75] text-white/52">
              {slide.description}
            </p>
          </div>

          <div className="mt-6">
            {slide.location && (
              <p className="mb-2 flex items-center gap-1.5 font-body text-[0.74rem] text-white/38">
                <MapPin className="h-3 w-3 shrink-0" />
                {slide.location}
              </p>
            )}
            {slide.date !== 'Date TBA' && (
              <p className="mb-5 font-ui text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white/45">
                {slide.date}
              </p>
            )}
            {slide.href ? (
              <Link
                href={slide.href}
                className="inline-flex h-10 items-center gap-2 bg-[var(--app-primary)] px-5 font-ui text-[0.75rem] font-bold text-[#0d0a06] transition hover:bg-[var(--app-primary-light)]"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                {slide.cta}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // Portrait card
  return (
    <div
      className="group flex flex-col overflow-hidden bg-[var(--app-canvas-2)]"
      style={{ borderRadius: 'var(--radius-card)' }}
    >
      {/* Image — 3/4 aspect */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--app-ink)]/10">
        <img
          src={slide.imageUrl}
          alt={slide.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {isReel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-[1.06]">
              <Play className="h-4 w-4 fill-black text-black" />
            </div>
          </div>
        )}
        {/* Date chip */}
        <div
          className="absolute left-4 top-4 bg-[var(--app-primary)] px-2.5 py-1 font-ui text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#0d0a06]"
          style={{ borderRadius: 'var(--radius-badge)' }}
        >
          {slide.date}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col border-t border-[var(--app-ink)]/8 px-5 py-5">
        <span className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
          {slide.badge}
        </span>
        <p className="mt-2 font-headline text-[1.08rem] font-normal leading-snug text-[var(--app-ink)]">
          {slide.title}
        </p>
        {slide.location && (
          <p className="mt-1.5 flex items-center gap-1.5 font-body text-[0.73rem] text-[var(--app-ink)]/40">
            <MapPin className="h-3 w-3 shrink-0" />
            {slide.location}
          </p>
        )}
        {slide.href ? (
          <Link
            href={slide.href}
            className="mt-auto inline-flex items-center gap-1 pt-4 font-ui text-[0.73rem] font-semibold text-[var(--app-ink)]/55 transition hover:text-[var(--app-primary)]"
          >
            {slide.cta} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */

export default function EventsShowcase() {
  const [category, setCategory] = useState<ShowcaseCategory>('program');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [reelModal, setReelModal] = useState<Slide | null>(null);

  useEffect(() => {
    let mounted = true;
    apiClient
      .listEvents()
      .then(data => {
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setEvents([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const programSlides = useMemo<Slide[]>(
    () =>
      events.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description || 'Join us for this gathering.',
        date: formatDate(e.startAt),
        location: e.location || 'Venue TBA',
        imageUrl: e.bannerUrl || e.imageUrl || EventBannerDesktop.src,
        cta: 'Save a seat',
        href: e.formSlug ? `/forms/${e.formSlug}` : '/events',
        badge: statusBadge(e.startAt, e.endAt),
        category: 'program',
        start: e.startAt,
        end: e.endAt,
      })),
    [events]
  );

  const activeSlides = useMemo<Slide[]>(() => {
    if (category === 'program') return programSlides;
    return STATIC_SLIDES.filter(s => s.category === category);
  }, [category, programSlides]);

  const isLoading = loading && category === 'program';
  const featured = activeSlides[0];
  const rest = activeSlides.slice(1, 4); // max 3 portrait cards

  return (
    <Section padding="none" className="bg-[var(--app-canvas)]">
      <Container size="xl" className="py-section-md">
        {/* ── Section header ───────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Events &amp; Programs
            </p>
            <h2
              className="font-headline font-normal leading-tight text-[var(--app-ink)]"
              style={{ fontSize: 'var(--type-display-sm)' }}
            >
              What&apos;s happening
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Category tabs */}
            <div className="flex gap-0.5 border-b border-[var(--app-ink)]/10">
              {(Object.keys(CATEGORY_LABELS) as ShowcaseCategory[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={[
                    'px-3.5 py-2 font-ui text-[0.72rem] font-semibold transition',
                    category === cat
                      ? 'border-b-2 border-[var(--app-primary)] text-[var(--app-ink)]'
                      : 'border-b-2 border-transparent text-[var(--app-ink)]/40 hover:text-[var(--app-ink)]/70',
                  ].join(' ')}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
            <Link
              href="/events"
              className="hidden font-ui text-[0.75rem] font-semibold text-[var(--app-primary)] transition sm:inline-flex sm:items-center sm:gap-1.5"
            >
              See all →
            </Link>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-[var(--app-ink)]/50">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading events…
            </div>
          </div>
        ) : activeSlides.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
            <p className="font-headline text-[1.5rem] text-[var(--app-ink)]/30">
              Nothing scheduled right now.
            </p>
            <Link
              href="/events"
              className="text-sm font-semibold text-[var(--app-primary)]"
            >
              Browse all events →
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28 }}
            >
              <div className="grid gap-5 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
                {/* Featured (horizontal) */}
                {featured && (
                  <div className="lg:row-span-1">
                    <EventCard slide={featured} featured />
                  </div>
                )}

                {/* Portrait cards */}
                {rest.map(slide => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={
                      slide.category === 'reel'
                        ? () => setReelModal(slide)
                        : undefined
                    }
                    className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
                  >
                    <EventCard slide={slide} />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Mobile see all */}
        <div className="mt-8 sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--app-primary)]"
          >
            See all events →
          </Link>
        </div>
      </Container>

      {/* Reel modal */}
      {reelModal && (
        <BaseModal
          isOpen
          onClose={() => setReelModal(null)}
          title={reelModal.title}
          subtitle={reelModal.description}
          maxWidth="max-w-3xl"
        >
          {reelModal.videoUrl ? (
            <video
              controls
              className="w-full rounded-[var(--radius-card)] bg-black"
              poster={reelModal.imageUrl}
            >
              <source src={reelModal.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-[var(--radius-card)] bg-black/70">
              <Play className="h-10 w-10 text-white/50" />
            </div>
          )}
        </BaseModal>
      )}
    </Section>
  );
}
