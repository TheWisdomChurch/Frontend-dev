'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ImageOff, Play } from 'lucide-react';

import { EventBannerDesktop } from '@/shared/assets';
import { Container } from '@/shared/layout';
import { apiClient } from '@/lib/api';
import type { EventPublic, ReelPublic } from '@/lib/apiTypes';
import { AnimatePresence, motion } from '@/lib/safe-motion';
import { BaseModal } from '@/shared/ui/modals/Base';
import { IMAGE_QUALITY } from '@/shared/constants';
import SectionGlow from '@/shared/ui/SectionGlow';
import {
  staggerContainer,
  staggerItem,
} from '@/shared/ui/motion/staggerReveal';

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

/* ── Slide image — real next/image, honest empty state on load failure ── */

function SlideImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--app-dark-2)]">
        <ImageOff className="h-6 w-6 text-white/25" aria-hidden="true" />
      </div>
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      fill
      quality={IMAGE_QUALITY}
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

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

/* ── Featured card — always full-width on mobile, horizontal split on lg ── */

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
        'group relative flex overflow-hidden bg-[var(--app-ink)]',
        fullWidth
          ? 'min-h-[320px] lg:min-h-[400px]'
          : 'min-h-[280px] lg:min-h-[360px]',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      {/* Image — left half */}
      <div
        className={`relative shrink-0 overflow-hidden ${fullWidth ? 'w-1/2 lg:w-[55%]' : 'w-[52%]'}`}
      >
        <SlideImage
          src={slide.imageUrl}
          alt={slide.title}
          sizes={
            fullWidth
              ? '(max-width: 1024px) 50vw, 55vw'
              : '(max-width: 1024px) 52vw, 30vw'
          }
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--app-ink)]/35" />
        {isReel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl transition duration-300 group-hover:scale-[1.1]">
              <Play className="h-5 w-5 fill-black text-black" />
            </div>
          </div>
        )}
      </div>

      {/* Content — right half */}
      <div
        className={`flex flex-1 flex-col justify-between ${fullWidth ? 'p-8 lg:p-12' : 'p-6 lg:p-8'}`}
      >
        <div>
          <span className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            {slide.badge} · Featured
          </span>
          <p
            className={`mt-4 font-headline font-normal leading-snug text-white ${fullWidth ? 'text-[1.7rem] lg:text-[2.1rem]' : 'text-[1.4rem] lg:text-[1.65rem]'}`}
          >
            {slide.title}
          </p>
          <p className="mt-3 line-clamp-3 font-ui text-[0.82rem] leading-[1.8] text-white/68">
            {slide.description}
          </p>
        </div>

        <div className="mt-6 space-y-2">
          {slide.date !== 'Date TBA' && (
            <p className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/40">
              {slide.date}
            </p>
          )}
          {slide.location && (
            <p className="font-ui text-[0.72rem] text-white/35">
              {slide.location}
            </p>
          )}
          {/* CTA — Link for navigable cards, plain styled span for reel (whole card is clickable) */}
          {slide.href && !isReel && (
            <Link
              href={slide.href}
              className="mt-4 inline-flex items-center gap-2 border border-white/20 px-5 py-2.5 font-ui text-[0.72rem] font-semibold text-white/60 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {slide.cta} <Arrow />
            </Link>
          )}
          {isReel && (
            <span className="mt-4 inline-flex items-center gap-2 border border-white/20 px-5 py-2.5 font-ui text-[0.72rem] font-semibold text-white/60">
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
}: {
  slide: Slide;
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
        'group flex h-full flex-col overflow-hidden border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)] transition duration-200 hover:border-[var(--app-primary)]/30',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--app-ink)]/8">
        <SlideImage
          src={slide.imageUrl}
          alt={slide.title}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
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
        <div className="absolute left-4 top-4 bg-[var(--app-primary)] px-2.5 py-1 font-ui text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[var(--app-ink)]">
          {slide.date}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-2 px-5 py-4">
        <span className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
          {slide.badge}
        </span>
        <p className="font-headline text-[1.05rem] font-normal leading-snug text-[var(--app-ink)] line-clamp-2">
          {slide.title}
        </p>
        {slide.location && (
          <p className="font-ui text-[0.73rem] text-[var(--app-ink)]/40">
            {slide.location}
          </p>
        )}
        {/* Link for nav cards; plain span for reels (whole card is clickable) */}
        {slide.href && !isReel && (
          <Link
            href={slide.href}
            className="mt-auto pt-3 font-ui text-[0.72rem] font-semibold text-[var(--app-ink)]/45 transition hover:text-[var(--app-primary)]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {slide.cta} →
          </Link>
        )}
        {isReel && (
          <span className="mt-auto pt-3 font-ui text-[0.72rem] font-semibold text-[var(--app-ink)]/45">
            {slide.cta} →
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────── */

function EmptyState({ category }: { category: Category }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)] px-8 py-16 text-center lg:min-h-[360px]">
      <div className="h-[1.5px] w-8 bg-[var(--app-primary)]/50" />
      <p className="font-headline text-[1.5rem] font-normal text-[var(--app-ink)]">
        {category === 'program'
          ? 'No programs scheduled right now.'
          : 'No reels published yet.'}
      </p>
      <p className="max-w-sm font-ui text-[0.82rem] leading-[1.85] text-[var(--app-ink)]/48">
        {category === 'program'
          ? 'Join us every Sunday at 9:00 AM, and for Daily Prayer Mon–Fri at 7:00 AM, at Honor Gardens, Lekki-Epe Expressway.'
          : 'Check back soon — new content is added regularly.'}
      </p>
      <Link
        href={category === 'program' ? '/events' : '/resources'}
        className="inline-flex items-center gap-2 border border-[var(--app-ink)]/18 px-5 py-2.5 font-ui text-[0.72rem] font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
      >
        {category === 'program' ? 'View all events' : 'Go to resources'}{' '}
        <Arrow />
      </Link>
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────── */

function Skeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div className="min-h-[320px] animate-pulse border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)] lg:min-h-[360px]" />
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
  if (restCount === 1) return 'lg:grid-cols-[1.5fr_1fr]';
  if (restCount === 2) return 'lg:grid-cols-[1.4fr_repeat(2,1fr)]';
  return 'lg:grid-cols-[1.4fr_repeat(3,1fr)]';
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
      events.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description || 'Join us for this gathering.',
        date: formatDate(e.startAt),
        location: e.location || 'Honor Gardens, Lagos',
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
    <section className="relative overflow-hidden min-w-0 bg-[var(--app-canvas)] py-16 lg:py-20">
      <SectionGlow />
      <Container size="xl">
        {/* ── Section header ──────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-ui text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Events &amp; Programs
            </p>
            <h2 className="font-headline text-[2rem] font-normal leading-tight text-[var(--app-ink)] sm:text-[2.5rem] lg:text-[2.8rem]">
              What&apos;s happening
            </h2>
          </div>

          <div className="flex items-center gap-5">
            {/* Category tabs */}
            <div
              role="tablist"
              aria-label="Event content category"
              className="flex gap-0 overflow-x-auto border border-[var(--app-ink)]/10"
            >
              {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={category === cat}
                  onClick={() => setCategory(cat)}
                  className={[
                    'px-4 py-2.5 font-ui text-[0.72rem] font-semibold transition duration-150',
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
              className="hidden items-center gap-1.5 border border-[var(--app-ink)]/14 px-4 py-2.5 font-ui text-[0.72rem] font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] sm:inline-flex"
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
                  <motion.div variants={staggerItem}>
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

                {/* Portrait cards */}
                {rest.map(slide => (
                  <motion.div key={slide.id} variants={staggerItem}>
                    <PortraitCard
                      slide={slide}
                      onClick={
                        slide.category === 'reel'
                          ? () => setReelModal(slide)
                          : undefined
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Mobile see-all */}
        <div className="mt-8 sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 border border-[var(--app-ink)]/14 px-5 py-2.5 font-ui text-[0.72rem] font-semibold text-[var(--app-ink)]/50 transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
          >
            See all events <Arrow />
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
              <Play className="h-10 w-10 text-white/30" />
              <p className="font-ui text-[0.8rem] text-white/45">
                This reel&apos;s video isn&apos;t available right now.
              </p>
            </div>
          )}
        </BaseModal>
      )}
    </section>
  );
}
