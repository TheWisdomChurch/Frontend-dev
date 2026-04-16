'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import type { EventPublic, ReelPublic } from '@/lib/apiTypes';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image: {
    src: string;
    alt: string;
    objectPosition?: string;
  };
  upcoming: {
    label: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
    ctaLabel: string;
    ctaTarget?: string;
    ctaUrl?: string;
  };
  type: 'event' | 'reel' | 'highlight';
}

const DEFAULT_FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 'welcome',
    title: 'Welcome to The Wisdom Church',
    subtitle: 'Equipping and Empowering for greatness',
    description:
      'A Spirit-filled family helping believers grow in faith, purpose, and community.',
    image: {
      src: '/HEADER.png',
      alt: "Experience God's Transforming Power",
      objectPosition: 'center',
    },
    upcoming: {
      label: 'Welcome',
      title: 'Join Our Community',
      date: 'Year-round',
      ctaLabel: 'Get Started',
      ctaTarget: '#join',
    },
    type: 'highlight',
  },
];

const FETCH_TIMEOUT_MS = 12000;
const RETRY_DELAY_MS = 2500;
const MAX_RETRIES = 1;

function formatEventDate(startAt?: string, endAt?: string): string {
  if (!startAt) return 'Upcoming';

  const startDate = new Date(startAt);
  if (Number.isNaN(startDate.getTime())) return 'Upcoming';

  const endDate = endAt ? new Date(endAt) : startDate;
  const validEndDate = Number.isNaN(endDate.getTime()) ? startDate : endDate;

  const startLabel = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const endLabel = validEndDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return startDate.toDateString() !== validEndDate.toDateString()
    ? `${startLabel} - ${endLabel}`
    : startLabel;
}

function formatEventTime(startAt?: string): string | undefined {
  if (!startAt) return undefined;

  const startDate = new Date(startAt);
  if (Number.isNaN(startDate.getTime())) return undefined;

  return startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function mapEventToHeroSlide(event: EventPublic): HeroSlide {
  const dateLabel = formatEventDate(event.startAt, event.endAt);

  return {
    id: String(event.id),
    title: dateLabel,
    subtitle: event.title || 'Upcoming Event',
    description: event.description || undefined,
    image: {
      src: event.imageUrl || event.bannerUrl || '/images/event-placeholder.jpg',
      alt: event.title || 'Church event',
      objectPosition: 'center',
    },
    upcoming: {
      label: 'Upcoming',
      title: event.title || 'Upcoming Event',
      date: dateLabel,
      time: formatEventTime(event.startAt),
      location: event.location || undefined,
      ctaLabel: 'Register Now',
      ctaUrl: event.registerLink || `/events/${event.id}`,
    },
    type: 'event',
  };
}

function mapReelToHeroSlide(reel: ReelPublic): HeroSlide {
  return {
    id: String(reel.id),
    title: reel.title || 'Latest Media',
    subtitle: 'Latest Media',
    description: reel.description || undefined,
    image: {
      src: reel.thumbnailUrl || '/images/reel-placeholder.jpg',
      alt: reel.title || 'Media reel',
      objectPosition: 'center',
    },
    upcoming: {
      label: 'Watch',
      title: reel.title || 'Latest Media',
      date: reel.publishedAt
        ? new Date(reel.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : 'Recently',
      ctaLabel: 'Watch Now',
      ctaUrl: `/resources/reels/${reel.id}`,
    },
    type: 'reel',
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error('Hero content request timed out'));
    }, timeoutMs);

    promise
      .then(value => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch(error => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

export const useHeroContent = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_FALLBACK_SLIDES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const fetchHeroData = useCallback(async () => {
    clearRetryTimer();

    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const heroDataPromise = Promise.all([
        apiClient.listEvents().catch(err => {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Hero events fetch failed, using empty list:', err);
          }
          return [] as EventPublic[];
        }),
        apiClient.listReels?.().catch(err => {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Hero reels fetch failed, using empty list:', err);
          }
          return [] as ReelPublic[];
        }) ?? Promise.resolve([] as ReelPublic[]),
      ]);

      const [events, reels] = await withTimeout(
        heroDataPromise,
        FETCH_TIMEOUT_MS
      );

      if (!mountedRef.current) return;

      const upcomingEvents = Array.isArray(events)
        ? events
            .filter(event => {
              if (!event?.startAt) return false;
              const date = new Date(event.startAt);
              return !Number.isNaN(date.getTime()) && date > new Date();
            })
            .slice(0, 3)
            .map(mapEventToHeroSlide)
        : [];

      const reelSlides = Array.isArray(reels)
        ? reels.slice(0, 2).map(mapReelToHeroSlide)
        : [];

      const nextSlides = [...upcomingEvents, ...reelSlides];

      setSlides(nextSlides.length > 0 ? nextSlides : DEFAULT_FALLBACK_SLIDES);
      setError(null);
      retryCountRef.current = 0;
    } catch (err) {
      if (!mountedRef.current) return;

      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load hero content';

      const isSoftTimeout = /timed out|timeout/i.test(errorMessage);
      const isRetriable = /timed out|timeout|network|fetch/i.test(errorMessage);

      if (process.env.NODE_ENV !== 'production' && !isSoftTimeout) {
        console.error('Error fetching hero content:', errorMessage, err);
      } else if (process.env.NODE_ENV !== 'production' && isSoftTimeout) {
        console.warn(
          'Hero content fetch timed out. Falling back to default slides.'
        );
      }

      setSlides(DEFAULT_FALLBACK_SLIDES);

      if (isSoftTimeout) {
        setError(null);
      } else {
        setError(errorMessage);
      }

      if (isRetriable && retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;

        retryTimerRef.current = window.setTimeout(() => {
          if (mountedRef.current) {
            void fetchHeroData();
          }
        }, RETRY_DELAY_MS);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void fetchHeroData();

    return () => {
      mountedRef.current = false;
      clearRetryTimer();
    };
  }, [fetchHeroData]);

  return {
    slides,
    loading,
    error,
    refetch: fetchHeroData,
  };
};
