'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  Clapperboard,
  Film,
  Loader2,
  MapPin,
  Play,
} from 'lucide-react';

import { BaseModal } from '@/shared/ui/modals/Base';
import { hero_bg_1, hero_bg_3, EventBannerDesktop } from '@/shared/assets';
import { lightShades } from '@/shared/colors/colorScheme';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { Container, Section } from '@/shared/layout';
import { BodySM, Caption, H3, SmallText } from '@/shared/text';
import { apiClient } from '@/lib/api';
import type { EventPublic, ReelPublic } from '@/lib/apiTypes';

import { AnimatePresence, motion } from '@/lib/safe-motion';

type ShowcaseCategory = 'program' | 'media' | 'reel';

type Slide = {
  id: string;
  title: string;
  subtitle: string;
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
    subtitle: 'Media',
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
    subtitle: 'Reels',
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
  program: 'Programs & Events',
  media: 'Media',
  reel: 'Reels',
};

const CATEGORY_META: Record<
  ShowcaseCategory,
  {
    eyebrow: string;
    icon: typeof CalendarDays;
    empty: string;
  }
> = {
  program: {
    eyebrow: 'Live calendar',
    icon: CalendarDays,
    empty: 'No approved events available yet.',
  },
  media: {
    eyebrow: 'Media stories',
    icon: Film,
    empty: 'No media stories available yet.',
  },
  reel: {
    eyebrow: 'Recent highlights',
    icon: Clapperboard,
    empty: 'No reels available yet.',
  },
};

function formatEventDate(startAt?: string): string {
  if (!startAt) return 'Date to be announced';

  const parsed = new Date(startAt);
  if (Number.isNaN(parsed.getTime())) return 'Date to be announced';

  return parsed.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusFromRange(startAt?: string, endAt?: string): string {
  if (!startAt) return 'Upcoming';

  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return 'Upcoming';

  const end = endAt ? new Date(endAt) : null;
  const now = Date.now();
  const startTime = start.getTime();
  const endTime =
    end && !Number.isNaN(end.getTime()) ? end.getTime() : startTime;

  if (now >= startTime && now <= endTime) return 'Happening now';
  if (now < startTime) return 'Upcoming';

  const daysAgo = (now - endTime) / (1000 * 60 * 60 * 24);
  return daysAgo <= 90 ? 'Recent' : 'Past';
}

export default function EventsShowcase() {
  const { colorScheme = lightShades } = useTheme();

  const [category, setCategory] = useState<ShowcaseCategory>('program');
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingReels, setLoadingReels] = useState(true);
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [reels, setReels] = useState<ReelPublic[]>([]);
  const [reelModal, setReelModal] = useState<Slide | null>(null);

  const activeMeta = CATEGORY_META[category];
  const ActiveIcon = activeMeta.icon;

  useEffect(() => {
    let mounted = true;

    const loadEvents = async () => {
      try {
        const data = await apiClient.listEvents();
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.warn('Failed to load events showcase', error);
        if (mounted) setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadReels = async () => {
      try {
        const data = await apiClient.listReels();
        if (mounted) setReels(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setReels([]);
      } finally {
        if (mounted) setLoadingReels(false);
      }
    };

    loadReels();

    return () => {
      mounted = false;
    };
  }, []);

  const programSlides = useMemo<Slide[]>(() => {
    return events.map(event => {
      const status = statusFromRange(event.startAt, event.endAt);

      return {
        id: event.id,
        title: event.title,
        subtitle: status,
        description: event.description || 'Join us for this gathering.',
        date: formatEventDate(event.startAt),
        location: event.location || 'Venue to be announced',
        imageUrl: event.bannerUrl || event.imageUrl || EventBannerDesktop.src,
        cta: 'Save a seat',
        href: event.formSlug ? `/forms/${event.formSlug}` : '/events',
        badge: status,
        category: 'program',
        start: event.startAt,
        end: event.endAt,
      };
    });
  }, [events]);

  const reelSlides = useMemo<Slide[]>(
    () =>
      reels.map(reel => {
        const reelData = reel as ReelPublic & {
          caption?: string;
          description?: string;
          createdAt?: string;
          created_at?: string;
          publishedAt?: string;
          published_at?: string;
          thumbnailUrl?: string;
          thumbnail_url?: string;
          videoUrl?: string;
          video_url?: string;
        };

        const createdDate =
          reelData.createdAt ||
          reelData.created_at ||
          reelData.publishedAt ||
          reelData.published_at;

        return {
          id: reelData.id,
          title: reelData.title,
          subtitle: 'Reel',
          description:
            reelData.caption ||
            reelData.description ||
            'Recent church highlight.',
          date: createdDate
            ? new Date(createdDate).toLocaleDateString()
            : 'Recently added',
          location: 'Wisdom House Media',
          imageUrl:
            reelData.thumbnailUrl ||
            reelData.thumbnail_url ||
            EventBannerDesktop.src,
          cta: 'Watch reel',
          href: reelData.videoUrl || reelData.video_url || undefined,
          badge: 'Reel',
          category: 'reel',
          videoUrl: reelData.videoUrl || reelData.video_url || undefined,
        };
      }),
    [reels]
  );

  const activeSlides = useMemo<Slide[]>(() => {
    if (category === 'program') return programSlides;
    if (category === 'reel') return reelSlides;
    return STATIC_SLIDES.filter(slide => slide.category === category);
  }, [category, programSlides, reelSlides]);

  const isLoading =
    (loading && category === 'program') ||
    (loadingReels && category === 'reel');

  useEffect(() => {
    setActive(0);
  }, [category]);

  useEffect(() => {
    if (activeSlides.length === 0) {
      setActive(0);
      return;
    }

    if (active >= activeSlides.length) {
      setActive(0);
    }
  }, [active, activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive(prev => (prev + 1) % activeSlides.length);
    }, 7500);

    return () => window.clearInterval(timer);
  }, [activeSlides.length]);

  const current = activeSlides[active];

  return (
    <Section padding="lg" className="relative overflow-hidden bg-[#050505]">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(circle at 15% 15%, rgba(247,222,18,0.12), transparent 32%), radial-gradient(circle at 90% 10%, rgba(255,255,255,0.07), transparent 28%), radial-gradient(circle at 50% 100%, rgba(247,222,18,0.08), transparent 34%)',
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
      </div>

      <Container size="xl" className="relative z-10 space-y-8 sm:space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              style={{
                borderColor: `${colorScheme.primary}33`,
                background: `${colorScheme.primary}12`,
                color: colorScheme.primary,
              }}
            >
              <ActiveIcon className="h-3.5 w-3.5" />
              <Caption className="text-[10px] font-bold uppercase tracking-[0.24em]">
                {activeMeta.eyebrow}
              </Caption>
            </div>

            <H3 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-5xl">
              What&apos;s happening now
            </H3>

            <BodySM
              className="mt-4 max-w-xl text-[0.92rem] leading-7 text-white/65 sm:text-base"
              useThemeColor={false}
            >
              Live programs, church media stories, and recent reels from your
              backend — beautifully presented for members and first-time guests.
            </BodySM>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(CATEGORY_LABELS) as ShowcaseCategory[]).map(cat => {
              const isActive = category === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-4 py-2 text-[0.78rem] font-semibold transition sm:text-sm ${
                    isActive
                      ? 'border-transparent text-black shadow-[0_14px_35px_rgba(247,222,18,0.18)]'
                      : 'border-white/15 bg-white/[0.04] text-white/70 hover:border-white/25 hover:bg-white/[0.08] hover:text-white'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: colorScheme.primary }
                      : undefined
                  }
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] xl:gap-6">
          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/12 bg-[#0c0c0f] shadow-[0_32px_100px_rgba(0,0,0,0.42)] sm:min-h-[520px] lg:min-h-[560px]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white/70 backdrop-blur-xl">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading content…
                </div>
              </div>
            ) : current ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${current.id}-${category}-${active}`}
                  initial={{ opacity: 0, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.38 }}
                  className="absolute inset-0"
                >
                  <img
                    src={current.imageUrl}
                    alt={current.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/28 to-black/90" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/58 to-black/20" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />

                  {current.category === 'reel' && (
                    <button
                      type="button"
                      onClick={() => setReelModal(current)}
                      className="absolute left-1/2 top-1/2 z-20 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full border border-white/20 bg-white/95 px-5 py-3 text-sm font-bold text-black shadow-2xl transition hover:scale-[1.03]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                        <Play className="h-4 w-4 fill-white" />
                      </span>
                      Play reel
                    </button>
                  )}

                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 lg:p-9">
                    <div className="max-w-2xl">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-black"
                          style={{ backgroundColor: colorScheme.primary }}
                        >
                          {current.badge}
                        </span>

                        <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-semibold text-white/70 backdrop-blur-xl">
                          {current.subtitle}
                        </span>
                      </div>

                      <H3
                        className="max-w-2xl text-[2rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-4xl lg:text-5xl"
                        useThemeColor={false}
                      >
                        {current.title}
                      </H3>

                      <BodySM
                        className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base"
                        useThemeColor={false}
                      >
                        {current.description}
                      </BodySM>

                      <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/78 sm:text-sm">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/35 px-3 py-2 backdrop-blur-xl">
                          <Calendar
                            className="h-4 w-4"
                            style={{ color: colorScheme.primary }}
                          />
                          <span>{current.date}</span>
                        </div>

                        {current.location && (
                          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/12 bg-black/35 px-3 py-2 backdrop-blur-xl">
                            <MapPin
                              className="h-4 w-4 shrink-0"
                              style={{ color: colorScheme.primary }}
                            />
                            <span className="truncate">{current.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {current.category === 'reel' ? (
                          <button
                            type="button"
                            onClick={() => setReelModal(current)}
                            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
                            style={{ backgroundColor: colorScheme.primary }}
                          >
                            {current.cta} <Play className="h-4 w-4" />
                          </button>
                        ) : (
                          current.href && (
                            <a
                              href={current.href}
                              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
                              style={{ backgroundColor: colorScheme.primary }}
                            >
                              {current.cta}
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          )
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setActive(
                              prev =>
                                (prev + 1) % Math.max(activeSlides.length, 1)
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/[0.12]"
                        >
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div className="max-w-sm">
                  <ActiveIcon
                    className="mx-auto h-8 w-8"
                    style={{ color: colorScheme.primary }}
                  />
                  <p className="mt-4 text-sm leading-6 text-white/62">
                    {activeMeta.empty}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:max-h-[560px] lg:grid-cols-1 lg:content-start lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
            {activeSlides.map((slide, idx) => {
              const selected = idx === active;

              return (
                <button
                  key={`${slide.id}-${idx}`}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`group relative min-w-[290px] overflow-hidden rounded-[1.5rem] border p-3 text-left transition lg:min-w-0 ${
                    selected
                      ? 'border-white/22 bg-white/[0.09] shadow-[0_18px_55px_rgba(0,0,0,0.32)]'
                      : 'border-white/10 bg-white/[0.035] hover:border-white/18 hover:bg-white/[0.065]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/25" />

                      {slide.category === 'reel' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black">
                            <Play className="h-3.5 w-3.5 fill-black" />
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            selected ? 'opacity-100' : 'opacity-45'
                          }`}
                          style={{ backgroundColor: colorScheme.primary }}
                        />
                        <Caption
                          className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-white/45"
                          useThemeColor={false}
                        >
                          {slide.badge}
                        </Caption>
                      </div>

                      <SmallText
                        weight="bold"
                        className="line-clamp-1 text-white"
                        useThemeColor={false}
                      >
                        {slide.title}
                      </SmallText>

                      <Caption
                        className="mt-1 line-clamp-2 text-[0.78rem] leading-5 text-white/55"
                        useThemeColor={false}
                      >
                        {slide.description}
                      </Caption>
                    </div>

                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition ${
                        selected
                          ? 'translate-x-0 text-white'
                          : 'text-white/35 group-hover:translate-x-1 group-hover:text-white/70'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Container>

      {reelModal && (
        <BaseModal
          isOpen={Boolean(reelModal)}
          onClose={() => setReelModal(null)}
          title={reelModal.title}
          subtitle={reelModal.description}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              style={{
                borderColor: `${colorScheme.primary}33`,
                background: `${colorScheme.primary}12`,
                color: colorScheme.primary,
              }}
            >
              <Play className="h-3.5 w-3.5" />
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]">
                Reel
              </p>
            </div>

            {reelModal.videoUrl ? (
              <video
                controls
                className="w-full rounded-2xl border border-white/10 bg-black"
                poster={reelModal.imageUrl}
              >
                <source src={reelModal.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/70">
                <Play className="h-10 w-10 text-white/70" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                <p className="absolute bottom-4 left-4 text-sm text-white/70">
                  Upload reels media to enable playback.
                </p>
              </div>
            )}
          </div>
        </BaseModal>
      )}
    </Section>
  );
}
