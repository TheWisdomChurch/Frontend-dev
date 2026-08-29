'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { EventBannerDesktop } from '@/shared/assets';
import { apiClient } from '@/lib/api';
import type { EventPublic, ReelPublic } from '@/lib/apiTypes';
import { BaseModal } from '@/shared/ui/modals/Modal';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { Media } from '@/shared/ui/Media';
import Arrow from '@/shared/ui/icons/Arrow';
import {
  Container,
  Section,
  SectionEmpty,
  SectionHeader,
  interactiveCardClass,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import { staggerContainer, staggerItem } from '@/shared/ui/motion';
import { cn } from '@/lib/cn';

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
  videoUrl?: string;
};

const CATEGORY_LABELS: Record<Category, string> = {
  program: 'Programs',
  reel: 'Reels',
};

const DATE_TBA = 'Date TBA';

/* ── Helpers ────────────────────────────────────────────── */

function getEventTimestamp(event: EventPublic): number {
  if (event.startAt) {
    const t = new Date(event.startAt).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return Number.MAX_SAFE_INTEGER;
}

function formatDate(startAt?: string): string {
  if (!startAt) return DATE_TBA;
  const d = new Date(startAt);
  if (Number.isNaN(d.getTime())) return DATE_TBA;
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

/* ── Shared pieces ──────────────────────────────────────── */

function CategoryToggle({
  value,
  onChange,
}: {
  value: Category;
  onChange: (next: Category) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Event content category"
      className="inline-flex rounded-button border border-[var(--app-border)] bg-[var(--app-surface)] p-1"
    >
      {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={value === cat}
          onClick={() => onChange(cat)}
          className={cn(
            'rounded-sm px-4 py-1.5 font-ui text-label font-semibold transition duration-150',
            value === cat
              ? 'bg-[var(--app-ink)] text-[var(--app-surface-solid)] shadow-sm'
              : 'text-[var(--app-subtle)] hover:text-[var(--app-text)]'
          )}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}

function PlayBadge({ large = false }: { large?: boolean }) {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span
        className={cn(
          'flex items-center justify-center rounded-full bg-[var(--app-surface)] text-[var(--app-ink)] shadow-xl transition duration-300 group-hover:scale-110',
          large ? 'h-16 w-16' : 'h-12 w-12'
        )}
      >
        <Play
          className={large ? 'h-6 w-6 fill-current' : 'h-4 w-4 fill-current'}
        />
      </span>
    </span>
  );
}

function DatePill({ date, className }: { date: string; className?: string }) {
  if (date === DATE_TBA) return null;
  return (
    <span
      className={cn(
        'inline-flex rounded-badge bg-[var(--app-primary)] px-2.5 py-1 font-ui text-eyebrow font-bold uppercase tracking-[0.16em] text-[var(--app-ink)]',
        className
      )}
    >
      {date}
    </span>
  );
}

/** Whole-card link (events) or button (reels open a modal). */
function CardShell({
  slide,
  onReelClick,
  className,
  children,
}: {
  slide: Slide;
  onReelClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const base = cn(
    'group flex flex-col overflow-hidden rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] focus-visible:ring-offset-2',
    interactiveCardClass,
    className
  );

  if (slide.category === 'reel') {
    return (
      <button
        type="button"
        onClick={onReelClick}
        className={cn(base, 'w-full')}
      >
        {children}
      </button>
    );
  }
  return (
    <Link href={slide.href ?? '/events'} className={base}>
      {children}
    </Link>
  );
}

/* ── Featured card ──────────────────────────────────────── */

function FeaturedCard({
  slide,
  onReelClick,
}: {
  slide: Slide;
  onReelClick?: () => void;
}) {
  const isReel = slide.category === 'reel';
  return (
    <CardShell slide={slide} onReelClick={onReelClick} className="lg:flex-row">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--app-canvas-2)] sm:aspect-[2/1] lg:aspect-auto lg:w-[54%]">
        <Media
          src={slide.imageUrl}
          alt={slide.title}
          frameClassName="bg-[var(--app-canvas-2)]"
          sizes="(max-width: 1023px) 100vw, 45vw"
          className="object-center transition duration-700 group-hover:scale-[1.04]"
        />
        {isReel ? <PlayBadge large /> : null}
        <DatePill date={slide.date} className="absolute left-4 top-4" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8 lg:p-10">
        <span className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary-dark)]">
          {slide.badge} · Featured
        </span>
        <h3 className="font-ui text-heading-md font-semibold leading-snug text-[var(--app-text)] sm:text-heading-lg">
          {slide.title}
        </h3>
        <p className="line-clamp-3 font-ui text-body-sm leading-[1.8] text-[var(--app-muted)]">
          {slide.description}
        </p>

        <div className="mt-auto flex flex-col gap-3 border-t border-[var(--app-border)] pt-5">
          {slide.location ? (
            <p className="inline-flex items-center gap-2 font-ui text-label text-[var(--app-subtle)]">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {slide.location}
            </p>
          ) : null}
          <span className={buttonClass('outline', 'sm', 'self-start')}>
            {slide.cta} <Arrow />
          </span>
        </div>
      </div>
    </CardShell>
  );
}

/* ── Grid card ──────────────────────────────────────────── */

function GridCard({
  slide,
  onReelClick,
}: {
  slide: Slide;
  onReelClick?: () => void;
}) {
  const isReel = slide.category === 'reel';
  return (
    <CardShell slide={slide} onReelClick={onReelClick} className="h-full">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[var(--app-canvas-2)]">
        <Media
          src={slide.imageUrl}
          alt={slide.title}
          frameClassName="bg-[var(--app-canvas-2)]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-center transition duration-500 group-hover:scale-[1.04]"
        />
        {isReel ? <PlayBadge /> : null}
        <DatePill date={slide.date} className="absolute left-4 top-4" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-primary-dark)]">
          {slide.badge}
        </span>
        <h3 className="font-ui text-heading-sm font-semibold leading-snug text-[var(--app-text)] line-clamp-2 transition group-hover:text-[var(--app-primary-dark)]">
          {slide.title}
        </h3>
        {slide.location ? (
          <p className="font-ui text-label text-[var(--app-muted)] line-clamp-1">
            {slide.location}
          </p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 font-ui text-label font-semibold text-[var(--app-subtle)] transition group-hover:text-[var(--app-primary-dark)]">
          {slide.cta}
          <Arrow className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </CardShell>
  );
}

/* ── Empty state ────────────────────────────────────────── */

function EmptyState({ category }: { category: Category }) {
  return (
    <SectionEmpty
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
    <div className="space-y-5">
      <div className="aspect-[16/10] animate-pulse rounded-card border border-[var(--app-border)] bg-[var(--app-canvas-2)] sm:aspect-[2/1] lg:aspect-[5/2]" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="aspect-[4/3] animate-pulse rounded-card border border-[var(--app-border)] bg-[var(--app-canvas-2)]"
          />
        ))}
      </div>
    </div>
  );
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
  const [featured, ...rest] = activeSlides;
  const gridSlides = rest.slice(0, 3);
  const hasContent = !isLoading && activeSlides.length > 0;

  return (
    <Section tone="surface">
      <Container>
        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Events & Programs"
            title="What's"
            accent="happening"
            size="sm"
          />

          <div className="flex flex-wrap items-center gap-3">
            <CategoryToggle value={category} onChange={setCategory} />
            {hasContent ? (
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 rounded-button border border-[var(--app-border)] px-4 py-2 font-ui text-label font-semibold text-[var(--app-subtle)] transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)]"
              >
                See all <Arrow />
              </Link>
            ) : null}
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────── */}
        <div className="mt-10">
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
                  className="space-y-5"
                >
                  {featured ? (
                    <motion.div variants={staggerItem}>
                      <FeaturedCard
                        slide={featured}
                        onReelClick={
                          featured.category === 'reel'
                            ? () => setReelModal(featured)
                            : undefined
                        }
                      />
                    </motion.div>
                  ) : null}

                  {gridSlides.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {gridSlides.map(slide => (
                        <motion.div key={slide.id} variants={staggerItem}>
                          <GridCard
                            slide={slide}
                            onReelClick={
                              slide.category === 'reel'
                                ? () => setReelModal(slide)
                                : undefined
                            }
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </Container>

      {/* ── Reel modal ──────────────────────────────────── */}
      {reelModal ? (
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
              className="w-full rounded-image bg-[var(--app-dark)]"
              poster={reelModal.imageUrl || undefined}
            >
              <source src={reelModal.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-image bg-[var(--app-dark-2)]">
              <Play className="h-10 w-10 text-[var(--app-subtle)]" />
              <p className="font-ui text-body-sm text-[var(--app-subtle)]">
                This reel&apos;s video isn&apos;t available right now.
              </p>
            </div>
          )}
        </BaseModal>
      ) : null}
    </Section>
  );
}
