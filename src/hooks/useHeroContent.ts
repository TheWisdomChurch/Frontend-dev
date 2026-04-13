// Hook to fetch hero and featured content from backend
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
    image: {
      src: '/HEADER.png',
      alt: "Experience God's Transforming Power",
    },
    upcoming: {
      label: 'Welcome',
      title: 'Join Our Community',
      date: 'Year-round',
      ctaLabel: 'Get Started',
      ctaTarget: '#join',
    },
    type: 'highlight' as const,
  },
];

export const useHeroContent = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_FALLBACK_SLIDES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  const fetchHeroData = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error('Request timeout: Hero content fetch took too long')
            ),
          20000 // 20 second timeout
        )
      );

      // Fetch events and reels in parallel with timeout
      const [events, reels] = (await Promise.race([
        Promise.all([
          apiClient.listEvents().catch(err => {
            console.warn('Failed to fetch events:', err);
            return [];
          }),
          apiClient
            .listReels?.()
            .catch(() => [])
            .then(data => data || []) || Promise.resolve([]),
        ]),
        timeoutPromise,
      ])) as [EventPublic[], ReelPublic[]];

      const heroSlides: HeroSlide[] = [];

      // Add upcoming events as slides
      if (events && events.length > 0) {
        const upcomingEvents = events
          .filter(
            (e: EventPublic) => e.startAt && new Date(e.startAt) > new Date()
          )
          .slice(0, 3)
          .map((event: EventPublic) => {
            const startDate = new Date(event.startAt || new Date());
            const endDate = event.endAt ? new Date(event.endAt) : startDate;
            const isMultiDay =
              startDate.toDateString() !== endDate.toDateString();

            return {
              id: event.id,
              title: isMultiDay
                ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : startDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  }),
              subtitle: event.title,
              description: event.description,
              image: {
                src:
                  event.imageUrl ||
                  event.bannerUrl ||
                  '/images/event-placeholder.jpg',
                alt: event.title,
                objectPosition: 'center',
              },
              upcoming: {
                label: 'Upcoming',
                title: event.title,
                date: isMultiDay
                  ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : startDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    }),
                time: startDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                location: event.location,
                ctaLabel: 'Register Now',
                ctaUrl: event.registerLink || `/events/${event.id}`,
              },
              type: 'event' as const,
            };
          });

        heroSlides.push(...upcomingEvents);
      }

      // Add recent reels
      if (reels && reels.length > 0) {
        const reelSlides = reels.slice(0, 2).map((reel: ReelPublic) => ({
          id: reel.id,
          title: reel.title,
          subtitle: 'Latest Media',
          description: reel.description,
          image: {
            src: reel.thumbnailUrl || '/images/reel-placeholder.jpg',
            alt: reel.title,
          },
          upcoming: {
            label: 'Watch',
            title: reel.title,
            date: reel.publishedAt
              ? new Date(reel.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recently',
            ctaLabel: 'Watch Now',
            ctaUrl: `/resources/reels/${reel.id}`,
          },
          type: 'reel' as const,
        }));

        heroSlides.push(...reelSlides);
      }

      // Use fallback if no backend data
      if (heroSlides.length === 0) {
        setSlides(DEFAULT_FALLBACK_SLIDES);
      } else {
        setSlides(heroSlides);
      }

      retryCountRef.current = 0;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load hero content';
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching hero content:', errorMessage, err);
      }

      if (/timeout/i.test(errorMessage)) {
        setError(null);
      } else {
        setError(errorMessage);
      }
      setSlides(DEFAULT_FALLBACK_SLIDES);

      // Auto-retry once on network/timeout errors
      if (
        retryCountRef.current < MAX_RETRIES &&
        /timeout|network|fetch/.test(errorMessage)
      ) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchHeroData();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroData();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchHeroData]);

  return { slides, loading, error, refetch: fetchHeroData };
};
