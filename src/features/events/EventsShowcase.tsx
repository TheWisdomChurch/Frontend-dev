'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

import { EventBannerDesktop } from '@/shared/assets';
import { apiClient } from '@/lib/api';
import type { EventPublic, ReelPublic } from '@/lib/apiTypes';
import { AnimatePresence, motion } from 'framer-motion';
import { BaseModal } from '@/shared/ui/modals/Modal';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { Media } from '@/shared/ui/Media';
import Arrow from '@/shared/ui/icons/Arrow';
import {
  EditorialContainer,
  EditorialEmptyState,
  EditorialHeader,
  EditorialSection,
} from '@/shared/ui/editorial';
import { buttonClass } from '@/shared/ui/button';
import { staggerContainer, staggerItem } from '@/shared/ui/motion';

/* ── Types ──────────────────────────────────────────────── */

type Category = 'program' | 'reel';

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
  category: Category;
  start?: string;
  end?: string;
  videoUrl?: string;
};

const CATEGORY_LABELS: Record<Category, string> = {
  program: 'Programs',
  reel: 'Reels',
};

/* ── Helpers ────────────────────────────────────────────── */

// Matches the sort/filter logic used on the /events hub so the "featured"
// event is consistent between the homepage and the hub instead of the two
// diverging due to independent, uncoordinated ordering.
function getEventTimestamp(event: EventPublic): number {
  if (event.startAt) {
    const t = new Date(event.startAt).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return Number.MAX_SAFE_INTEGER;
}

function formatDate(startAt?: string): string {
  if (!startAt) return 'Date TBA';
  const d = new Date(startAt);
  if (Number.isNaN(d.getTime())) return 'Date TBA';
  return d
    .toLocaleDateString('en', { month: 'short', day: '2-digit' })
    .toUpperCase();
}

function statusBadge(startAt?: string, endAt?: string): string {
  if (!startAt) return 'Upcoming';
  const start = new Date(startAt).getTime();
  const end = endAt ? new Date(endAt).getTime() : start;
  const now = Date.now();
  if (now >= start && now <= end) return 'Live now';
  if (now < start) return 'Upcoming';
  return 'Recent';
}

/* ── Featured card — stacked (image top, content below) through tablet,
   horizontal split from lg up ── */

function FeaturedCard({
  slide,
  fullWidth,
  onClick,
}: {
  slide: Slide;
  fullWidth?: boolean;
  onClick?: () => void;
}) {
  const isReel = slide.category === 'reel';

  const interactiveProps = onClick
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') onClick();
        },
      }
    : {};

  return (
    <div
      {...interactiveProps}
      className={[
        'group relative flex flex-col overflow-hidden bg-[var(--app-ink)] lg:flex-row',
        fullWidth ? 'lg:min-h-[400px]' : 'lg:min-h-[360px]',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      {/* Image — full-width top block through tablet, left column from lg up */}
      <div
        className={`relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-[2/1] lg:aspect-auto ${fullWidth ? 'lg:w-1/2' : 'lg:w-[52%]'}`}
      >
        <Media
          src={slide.imageUrl}
          alt={slide.title}
          frameClassName="bg-[var(--app-dark-2)]"
          sizes={
            fullWidth
              ? '(max-width: 1023px) 100vw, 55vw'
              : '(max-width: 1023px) 100vw, 30vw'
          }
          className="object-[center_22%] sm:object-center transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-ink)]/45 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[var(--app-ink)]/35" />
        {isReel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl transition duration-300 group-hover:scale-[1.1]">
              <Play className="h-5 w-5 fill-black text-black" />
            </div>
          </div>
        )}
      </div>

      {/* Content — full-width bottom block through tablet, right column from lg up */}
      <div
        className={`flex flex-1 flex-col justify-between p-6 sm:p-7 ${fullWidth ? 'lg:p-12' : 'lg:p-8'}`}
      >
        <div>
          <span className="font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            {slide.badge} · Featured
          </span>
          <p
            className={`mt-4 font-headline font-normal leading-snug text-white ${fullWidth ? 'text-heading-md sm:text-heading-md lg:text-heading-lg' : 'text-heading-sm sm:text-heading-md lg:text-heading-md'}`}
          >
            {slide.title}
          </p>
          <p className="mt-3 line-clamp-3 font-ui text-body-sm leading-[1.8] text-white/68">
            {slide.description}
          </p>
        </div>

        <div className="mt-6 space-y-2">
          {slide.date !== 'Date TBA' && (
            <p className="font-ui text-caption font-semibold uppercase tracking-[0.14em] text-white/40">
              {slide.date}
            </p>
          )}
          {slide.location && (
            <p className="font-ui text-label text-white/35">{slide.location}</p>
          )}
          {/* CTA — Link for navigable cards, plain styled span for reel (whole card is clickable) */}
          {slide.href && !isReel && (
            <Link
              href={slide.href}
              className="mt-4 inline-flex items-center gap-2 rounded-button border border-white/20 px-5 py-2.5 font-ui text-label font-semibold text-white/60 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {slide.cta} <Arrow />
            </Link>
          )}
          {isReel && (
            <span className="mt-4 inline-flex items-center gap-2 rounded-button border border-white/20 px-5 py-2.5 font-ui text-label font-semibold text-white/60">
              {slide.cta} <Arrow />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Portrait card ──────────────────────────────────────── */

function PortraitCard({
  slide,
  onClick,
  wide,
}: {
  slide: Slide;
  onClick?: () => void;
  /** True when this card spans the tablet row's full width (odd trailing
   * card) instead of sharing it — the image switches to a wider ratio so
   * it doesn't render as an oversized, oddly-tall portrait. */
  wide?: boolean;
}) {
  const isReel = slide.category === 'reel';

  const interactiveProps = onClick
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') onClick();
        },
      }
    : {};

  return (
    <div
      {...interactiveProps}
      className={[
        'group flex h-full overflow-hidden border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)] transition duration-200 hover:border-[var(--app-primary)]/30',
        wide ? 'flex-col sm:flex-row lg:flex-col' : 'flex-col',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      {/* Image */}
      <div
        className={[
          'relative shrink-0 overflow-hidden bg-[var(--app-ink)]/8',
          wide
            ? 'aspect-[16/10] sm:aspect-auto sm:w-2/5 lg:aspect-[4/5] lg:w-full'
            : 'aspect-[4/5]',
        ].join(' ')}
      >
        <Media
          src={slide.imageUrl}
          alt={slide.title}
          frameClassName="bg-[var(--app-ink)]/8"
          sizes={
            wide
              ? '(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 22vw'
              : '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw'
          }
          className="object-[center_18%] sm:object-center transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        {isReel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-[1.07]">
              <Play className="h-4 w-4 fill-black text-black" />
            </div>
          </div>
        )}
        {/* Date pill */}
        <div className="absolute left-4 top-4 bg-[var(--app-primary)] px-2.5 py-1 font-ui text-eyebrow font-bold uppercase tracking-[0.16em] text-[var(--app-ink)]">
          {slide.date}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-2 px-5 py-4">
        <span className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
          {slide.badge}
        </span>
        <p className="font-headline text-heading-sm font-normal leading-snug text-[var(--app-ink)] line-clamp-2">
          {slide.title}
        </p>
        {slide.location && (
          <p className="font-ui text-label text-[var(--app-ink)]/60">
            {slide.location}
          </p>
        )}
        {/* Link for nav cards; plain span for reels (whole card is clickable) */}
        {slide.href && !isReel && (
          <Link
            href={slide.href}
            className="mt-auto inline-flex w-fit items-center gap-2 border border-[var(--app-ink)]/14 px-4 py-2 pt-2 font-ui text-label font-semibold text-[var(--app-ink)]/55 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {slide.cta} <Arrow />
          </Link>
        )}
        {isReel && (
          <span className="mt-auto inline-flex w-fit items-center gap-2 border border-[var(--app-ink)]/14 px-4 py-2 font-ui text-label font-semibold text-[var(--app-ink)]/55">
            {slide.cta} <Arrow />
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────── */

function EmptyState({ category }: { category: Category }) {
  return (
    <EditorialEmptyState
      title={
        category === 'program'
          ? 'No programs scheduled right now.'
          : 'No reels published yet.'
      }
      description={
        category === 'program'
          ? `Join us every ${SERVICE_INFO.sunday.day} at ${SERVICE_INFO.sunday.time}, and for ${SERVICE_INFO.dailyPrayer.label} ${SERVICE_INFO.dailyPrayer.daysShort} at ${SERVICE_INFO.dailyPrayer.time}, at ${SERVICE_INFO.venue.short}.`
          : 'Check back soon — new content is added regularly.'
      }
      action={
        <Link
          href={category === 'program' ? '/events' : '/resources'}
          className={buttonClass('outline')}
        >
          {category === 'program' ? 'View all events' : 'Go to resources'}{' '}
          <Arrow />
        </Link>
      }
    />
  );
}

/* ── Skeleton ───────────────────────────────────────────── */

function Skeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div className="aspect-[16/10] animate-pulse border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)] sm:col-span-2 sm:aspect-[2/1] lg:col-span-1 lg:aspect-auto lg:min-h-[360px]" />
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="aspect-[4/5] animate-pulse border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)]"
        />
      ))}
    </div>
  );
}

/* ── Grid layout — adapts to number of slides ───────────── */

function gridCols(restCount: number) {
  if (restCount === 0) return '';
  if (restCount === 1) return 'sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr]';
  if (restCount === 2)
    return 'sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(2,1fr)]';
  return 'sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]';
}

/* ── Main component ─────────────────────────────────────── */

export default function EventsShowcase() {
  const [category, setCategory] = useState<Category>('program');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingReels, setLoadingReels] = useState(true);
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [reels, setReels] = useState<ReelPublic[]>([]);
  const [reelModal, setReelModal] = useState<Slide | null>(null);

  useEffect(() => {
    let live = true;
    apiClient
      .listEvents()
      .then(data => {
        if (live) setEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (live) setEvents([]);
      })
      .finally(() => {
        if (live) setLoadingEvents(false);
      });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let live = true;
    apiClient
      .listReels()
      .then(data => {
        if (live) setReels(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (live) setReels([]);
      })
      .finally(() => {
        if (live) setLoadingReels(false);
      });
    return () => {
      live = false;
    };
  }, []);

  const programSlides = useMemo<Slide[]>(
    () =>
      [...events]
        .sort((a, b) => getEventTimestamp(a) - getEventTimestamp(b))
        .map(e => ({
          id: e.id,
          title: e.title,
          description: e.description || 'Join us for this gathering.',
          date: formatDate(e.startAt),
          location: e.location || SERVICE_INFO.venue.short,
          imageUrl: e.bannerUrl || e.imageUrl || EventBannerDesktop.src,
          cta: 'Save a seat',
          href: e.formSlug ? `/forms/${e.formSlug}` : '/events',
          badge: statusBadge(e.startAt, e.endAt),
          category: 'program' as const,
          start: e.startAt,
          end: e.endAt,
        })),
    [events]
  );

  const reelSlides = useMemo<Slide[]>(
    () =>
      reels.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description || 'Watch this moment from Wisdom Church.',
        date: formatDate(r.publishedAt),
        location: 'Wisdom Church',
        imageUrl: r.thumbnailUrl || '',
        cta: 'Watch reel',
        badge: 'Reel',
        category: 'reel' as const,
        videoUrl: r.videoUrl,
      })),
    [reels]
  );

  const activeSlides = category === 'program' ? programSlides : reelSlides;
  const isLoading = category === 'program' ? loadingEvents : loadingReels;
  const featured = activeSlides[0] ?? null;
  const rest = activeSlides.slice(1, 4);
  const onlyFeatured = !!featured && rest.length === 0;

  return (
    <EditorialSection tone="surface" className="min-w-0 overflow-hidden">
      <EditorialContainer>
        {/* ── Section header ──────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <EditorialHeader
            eyebrow="Events & Programs"
            title="What's"
            accent="happening"
            size="sm"
          />

          <div className="flex items-center justify-end gap-5">
            {/* Category tabs */}
            <div
              role="tablist"
              aria-label="Event content category"
              className="flex shrink-0 gap-0 overflow-x-auto border border-[var(--app-ink)]/10"
            >
              {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={category === cat}
                  onClick={() => setCategory(cat)}
                  className={[
                    'px-4 py-2.5 font-ui text-label font-semibold transition duration-150',
                    category === cat
                      ? 'bg-[var(--app-ink)] text-white'
                      : 'text-[var(--app-ink)]/45 hover:bg-[var(--app-canvas-2)] hover:text-[var(--app-ink)]/70',
                  ].join(' ')}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            <Link
              href="/events"
              className="hidden items-center gap-1.5 rounded-button border border-[var(--app-ink)]/14 px-4 py-2.5 font-ui text-label font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] sm:inline-flex"
            >
              See all <Arrow />
            </Link>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────── */}
        {isLoading ? (
          <Skeleton />
        ) : activeSlides.length === 0 ? (
          <EmptyState category={category} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className={`grid gap-5 ${gridCols(rest.length)}`}
              >
                {/* Featured */}
                {featured && (
                  <motion.div
                    variants={staggerItem}
                    className="sm:col-span-2 lg:col-span-1"
                  >
                    <FeaturedCard
                      slide={featured}
                      fullWidth={onlyFeatured}
                      onClick={
                        featured.category === 'reel'
                          ? () => setReelModal(featured)
                          : undefined
                      }
                    />
                  </motion.div>
                )}

                {/* Portrait cards — the last card spans the tablet row's
                    remaining width when the count is odd, instead of
                    leaving an empty cell beside it. */}
                {rest.map((slide, index) => {
                  const isTrailingOdd =
                    rest.length % 2 === 1 && index === rest.length - 1;
                  return (
                    <motion.div
                      key={slide.id}
                      variants={staggerItem}
                      className={
                        isTrailingOdd ? 'sm:col-span-2 lg:col-span-1' : ''
                      }
                    >
                      <PortraitCard
                        slide={slide}
                        wide={isTrailingOdd}
                        onClick={
                          slide.category === 'reel'
                            ? () => setReelModal(slide)
                            : undefined
                        }
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Mobile see-all */}
        <div className="mt-8 sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-button border border-[var(--app-ink)]/14 px-5 py-2.5 font-ui text-label font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
          >
            See all events <Arrow />
          </Link>
        </div>
      </EditorialContainer>

      {/* Reel modal */}
      {reelModal && (
        <BaseModal
          isOpen
          onClose={() => setReelModal(null)}
          title={reelModal.title}
          subtitle={reelModal.description}
          maxWidth="max-w-3xl"
          forceBottomSheet
        >
          {reelModal.videoUrl ? (
            <video
              controls
              className="w-full bg-black"
              poster={reelModal.imageUrl}
            >
              <source src={reelModal.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-[var(--app-dark-2)]">
              <Play className="h-10 w-10 text-white/45" />
              <p className="font-ui text-body-sm text-white/45">
                This reel&apos;s video isn&apos;t available right now.
              </p>
            </div>
          )}
        </BaseModal>
      )}
    </EditorialSection>
  );
}
