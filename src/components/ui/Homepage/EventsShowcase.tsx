
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseModal } from '@/components/modal/Base';
import { Section, Container } from '@/components/layout';
import { Caption, H3, BodySM, SmallText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { lightShades } from '@/components/colors/colorScheme';
import { ArrowRight, Calendar, MapPin, Play } from 'lucide-react';
import { hero_bg_1, hero_bg_3, EventBannerDesktop, EventBannerMobile } from '@/components/assets';
import type { EventPublic } from '@/lib/apiTypes';

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  location: string;
  image: any;
  imageMobile?: any;
  imageDesktop?: any;
  cta?: string;
  href?: string;
  badge: string;
  category: 'program' | 'media' | 'reel';
  start?: string; // ISO
  end?: string; // ISO
  videoUrl?: string;
};

/* =========================================
   API ORIGIN (robust + matches your pattern)
========================================= */
function normalizeOrigin(raw?: string | null): string {
  // Prefer NEXT_PUBLIC_API_URL; fallback to NEXT_PUBLIC_API_BASE_URL
  const fallback = 'http://localhost:8080';
  const v = (raw ?? '').trim();
  if (!v) return fallback;

  // Remove trailing slashes
  let base = v.replace(/\/+$/, '');

  // If someone sets NEXT_PUBLIC_API_URL=https://domain.com/api/v1
  // normalize it back to origin so we can safely append /api/v1.
  if (base.endsWith('/api/v1')) {
    base = base.slice(0, -'/api/v1'.length);
  }

  return base || fallback;
}

const API_ORIGIN = normalizeOrigin(
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL
);
const API_V1_BASE = `${API_ORIGIN}/api/v1`;

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    method: init?.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}) ${text || url}`);
  }

  return (await res.json()) as T;
}

/**
 * Tries common event endpoints:
 * 1) /api/v1/events/public
 * 2) /api/v1/events
 *
 * Also supports either raw array response OR wrapped responses like:
 * { data: [...] } OR { data: { data: [...] } }
 */
async function listEventsPublic(): Promise<EventPublic[]> {
  const candidates = [`${API_V1_BASE}/events/public`, `${API_V1_BASE}/events`];

  let lastErr: unknown = null;

  for (const url of candidates) {
    try {
      const raw = await fetchJSON<any>(url);

      // If API returns an array directly
      if (Array.isArray(raw)) return raw as EventPublic[];

      // If API wraps with { data: [...] }
      if (raw && Array.isArray(raw.data)) return raw.data as EventPublic[];

      // If API wraps with { data: { data: [...] } }
      if (raw?.data && Array.isArray(raw.data.data)) return raw.data.data as EventPublic[];

      // If API wraps with { payload: [...] }
      if (raw && Array.isArray(raw.payload)) return raw.payload as EventPublic[];

      // Unknown shape -> treat as empty (or throw)
      return [];
    } catch (e) {
      lastErr = e;
      continue;
    }
  }

  // If both endpoints failed, surface the last error
  throw lastErr instanceof Error ? lastErr : new Error('Failed to load events');
}

export default function EventsShowcase() {
  const { colorScheme = lightShades } = useTheme();

  const slides: Slide[] = useMemo(
    () => [
      {
        title: 'Wisdom Power Conference 26',
        subtitle: 'Upcoming',
        description: 'City-wide gathering with worship, word, and miracles. Come expectant.',
        date: 'Mar 10 • 6:00 PM',
        location: 'Honor Gardens Event Center, Alasia opp. dominion Church',
        image: EventBannerDesktop,
        imageMobile: EventBannerMobile,
        imageDesktop: EventBannerDesktop,
        cta: 'Save a seat',
        href: '/events',
        badge: 'Upcoming',
        category: 'program',
        start: '2026-03-10T18:00:00.000Z',
        end: '2026-03-10T21:00:00.000Z',
      },
      {
        title: 'Highlights & Reels',
        subtitle: 'Media',
        description: 'Watch quick reels from recent services and events—perfect for sharing.',
        date: 'Updated weekly',
        location: 'Media Team',
        image: hero_bg_3,
        cta: 'Watch reels',
        href: '/resources/sermons',
        badge: 'Reels',
        category: 'reel',
        videoUrl: '',
      },
      {
        title: 'Media Stories',
        subtitle: 'Media',
        description: 'Short testimonies, sermon snippets, and behind-the-scenes moments.',
        date: 'New drops every week',
        location: 'Content Hub',
        image: hero_bg_1,
        cta: 'View media',
        href: '/resources',
        badge: 'Media',
        category: 'media',
        start: '2026-02-01T10:00:00.000Z',
        end: '2026-02-01T12:00:00.000Z',
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [category, setCategory] = useState<'program' | 'media' | 'reel'>('program');
  const [reelModal, setReelModal] = useState<Slide | null>(null);

  const [events, setEvents] = useState<EventPublic[]>([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  const filteredSlides = slides.filter((slide) => slide.category === category);

  const statusOf = (slide: Slide) => {
    if (!slide.start || !slide.end) return slide.badge;
    const now = new Date();
    const start = new Date(slide.start);
    const end = new Date(slide.end);
    if (now >= start && now <= end) return 'Happening now';
    if (now < start) return 'Upcoming';
    const daysAgo = (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 90 ? 'Recent' : 'Past';
  };

  // Keep active index valid when switching categories
  useEffect(() => {
    if (active >= filteredSlides.length) setActive(0);
  }, [category, filteredSlides.length, active]);

  // Auto-advance slides within selected category
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % Math.max(filteredSlides.length, 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [filteredSlides.length]);

  // Load events from backend
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await listEventsPublic();
        if (mounted && Array.isArray(data)) setEvents(data);
      } catch (err) {
        console.warn('Failed to load events', err);
      } finally {
        if (mounted) setEventsLoaded(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const programList: Slide[] =
    eventsLoaded && events.length && category === 'program'
      ? events.map((evt) => {
          const start = (evt as any).startAt as string | undefined;
          const end = (evt as any).endAt as string | undefined;

          const badge = (() => {
            if (!start || !end) return 'Upcoming';
            const now = new Date();
            const s = new Date(start);
            const e = new Date(end);
            if (now >= s && now <= e) return 'Happening now';
            if (now < s) return 'Upcoming';
            const daysAgo = (now.getTime() - e.getTime()) / (1000 * 60 * 60 * 24);
            return daysAgo <= 90 ? 'Recent' : 'Past';
          })();

          const title = (evt as any).title ?? 'Event';
          const description = (evt as any).description ?? '';
          // const location = (evt as any).location ?? '';
          // const bannerUrl = (evt as any).bannerUrl ?? (evt as any).imageUrl ?? HeaderAlt;
          const formSlug = (evt as any).formSlug as string | undefined;

          return {
            title,
            subtitle: badge,
            description,
            date: start ? new Date(start).toLocaleString() : '',
            location: evt.location || '',
            image: EventBannerDesktop,
            imageMobile: EventBannerMobile,
            imageDesktop: EventBannerDesktop,
            cta: 'Save a seat',
            href: formSlug ? `/forms/${formSlug}` : '/events',
            badge,
            category: 'program' as const,
            start,
            end,
          };
        })
      : filteredSlides;

  const current = programList[active];

  return (
    <Section padding="md" className="relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 12% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.06) 0%, transparent 35%), radial-gradient(circle at 60% 90%, rgba(255,255,255,0.05) 0%, transparent 40%)',
          filter: 'blur(70px)',
        }}
        data-parallax-global="0.25"
      />
      <Container size="xl" className="relative z-10 space-y-5">
        <div className="flex flex-col gap-1.5">
          <Caption className="uppercase tracking-[0.2em] text-xs" style={{ color: colorScheme.primary }}>
            Programs & Media
          </Caption>

          <H3 className="text-xl sm:text-2xl font-semibold text-white leading-tight">What’s happening now</H3>

          <BodySM className="text-white/75 max-w-3xl text-sm sm:text-base">
            Announcements, events, and reels in one place—swipe through the highlights.
          </BodySM>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(['program', 'media', 'reel'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  category === cat ? 'bg-white text-black border-white' : 'border-white/25 text-white hover:bg-white/10'
                }`}
              >
                {cat === 'program' ? 'Programs & Events' : cat === 'media' ? 'Media' : 'Reels'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-3 sm:gap-4 items-stretch">
          {/* HERO */}
          <div
            className="
              relative overflow-hidden rounded-3xl border border-white/15 bg-[#111] shadow-2xl
              h-[420px] sm:h-[480px] lg:h-auto
              lg:aspect-[16/9] lg:min-h-[340px]
            "
          >
            {current ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${current.title}-${category}-${active}`}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  {/* Image layer */}
                  <div className="absolute inset-0" data-parallax-global="0.2">
                    {current.category === 'reel' ? (
                      <div className="w-full h-full relative">
                        {current.imageMobile || current.imageDesktop ? (
                          <>
                            <Image
                              src={current.imageMobile || current.imageDesktop || current.image}
                              alt={current.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 60vw"
                              className="object-cover md:hidden"
                              style={{ objectPosition: 'center 35%' }}
                              priority
                            />
                            <Image
                              src={current.imageDesktop || current.imageMobile || current.image}
                              alt={current.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 60vw"
                              className="hidden md:block object-cover"
                              style={{ objectPosition: 'center 35%' }}
                              priority
                            />
                          </>
                        ) : (
                          <Image
                            src={current.image}
                            alt={current.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover"
                            // Mobile-friendly composition
                            style={{ objectPosition: 'center 35%' }}
                            priority
                          />
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <button
                            onClick={() => setReelModal(current)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.02] transition shadow-lg"
                          >
                            <Play className="w-4 h-4" /> Play reel
                          </button>
                        </div>
                      </div>
                    ) : (
                      current.imageMobile || current.imageDesktop ? (
                        <>
                          <Image
                            src={current.imageMobile || current.imageDesktop || current.image}
                            alt={current.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 60vw"
                            className="object-cover md:hidden"
                            style={{ objectPosition: 'center 35%' }}
                            priority
                          />
                          <Image
                            src={current.imageDesktop || current.imageMobile || current.image}
                            alt={current.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="hidden md:block object-cover"
                            style={{ objectPosition: 'center 35%' }}
                            priority
                          />
                        </>
                      ) : (
                        <Image
                          src={current.image}
                          alt={current.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover"
                          style={{ objectPosition: 'center 35%' }}
                          priority
                        />
                      )
                    )}
                  </div>

                  {/* Dark overlays */}
                  <div className="absolute inset-0 bg-black/25" data-parallax-global="0.12" />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25 lg:bg-gradient-to-r lg:from-black/88 lg:via-black/68 lg:to-black/45"
                    data-parallax-global="0.08"
                  />

                  {/* Cinematic film grain */}
                  <div
                    className="absolute inset-0 opacity-[0.18] mix-blend-soft-light"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }}
                  />

                  {/* Content */}
                  <div
                    className="
                      absolute inset-0 flex flex-col justify-end lg:justify-center
                      px-4 py-5 sm:px-7 sm:py-6 lg:px-10
                      gap-2.5 sm:gap-3
                      max-w-none lg:max-w-2xl
                    "
                  >
                    <div
                      className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{
                        background: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.18)',
                      }}
                    >
                      {statusOf(current)}
                    </div>

                    <SmallText className="text-white/70 text-sm line-clamp-1">{current.subtitle}</SmallText>

                    <H3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight">
                      {current.title}
                    </H3>

                    <BodySM className="text-white/80 text-sm sm:text-base line-clamp-3 sm:line-clamp-4">
                      {current.description}
                    </BodySM>

                    <div className="flex flex-wrap gap-2.5 text-white/80 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-300" />
                        <span className="line-clamp-1">{current.date}</span>
                      </div>

                      {current.location && (
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                          <span className="truncate">{current.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2.5 sm:gap-3 pt-1.5 flex-wrap">
                      {current.href && (
                        <a
                          href={current.href}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.02] transition"
                        >
                          {current.cta || 'Open'} <ArrowRight className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => setActive((prev) => (prev + 1) % Math.max(programList.length, 1))}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition"
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/60">
                No items in this category yet.
              </div>
            )}
          </div>

          {/* LIST */}
          <div
            className="
              flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1
              lg:grid lg:grid-cols-1 lg:gap-2.5 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0
              scroll-smooth
            "
          >
            {programList.map((slide, idx) => (
              <button
                key={`${slide.title}-${idx}`}
                onClick={() => setActive(idx)}
                className={`
                  relative overflow-hidden rounded-2xl border border-white/15 p-3.5 sm:p-4 text-left
                  transition-transform duration-200
                  ${idx === active ? 'bg-[#161616] shadow-xl' : 'bg-[#0f0f0f]'}
                  min-w-[280px] sm:min-w-[340px] lg:min-w-0
                `}
                data-parallax-global={idx % 2 === 0 ? '0.12' : '0.18'}
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="relative w-16 sm:w-20 aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shrink-0">
                    <Image
                      src={slide.imageDesktop || slide.image}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 1024px) 70vw, 25vw"
                      className="object-cover"
                      style={{ objectPosition: 'center 35%' }}
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div
                      className="absolute bottom-1 left-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                      style={{
                        background: 'rgba(255,255,255,0.16)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {slide.badge}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <SmallText weight="bold" className="text-white truncate">
                      {slide.title}
                    </SmallText>
                    <Caption className="text-white/60 line-clamp-2">{slide.description}</Caption>
                  </div>

                  <ArrowRight className="w-4 h-4 text-white/50 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* Reel modal/player */}
      {reelModal && (
        <BaseModal
          isOpen={Boolean(reelModal)}
          onClose={() => setReelModal(null)}
          title={reelModal.title}
          subtitle={reelModal.description}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Reel</p>
            {reelModal.videoUrl ? (
              <video
                controls
                className="w-full rounded-2xl border border-white/10 bg-black"
                poster={typeof reelModal.image === 'string' ? reelModal.image : undefined}
              >
                <source src={reelModal.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center">
                <Play className="w-10 h-10 text-white/70" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                <p className="absolute bottom-3 left-4 text-white/70 text-sm">
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
