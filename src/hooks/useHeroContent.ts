// Hook to fetch hero and featured content from backend
'use client';

import { useEffect, useState, useCallback } from 'react';
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

export const useHeroContent = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch events and reels in parallel
      const [events, reels] = await Promise.all([
        apiClient.listEvents(),
        apiClient.listReels?.() || Promise.resolve([]),
      ]);

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

      // Fallback to default slides if no backend data
      if (heroSlides.length === 0) {
        heroSlides.push({
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
        });
      }

      setSlides(heroSlides);
    } catch (err) {
      console.error('Error fetching hero content:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load hero content'
      );

      // Set minimal fallback
      setSlides([
        {
          id: 'fallback',
          title: 'Welcome to The Wisdom Church',
          subtitle: 'Equipping and Empowering for greatness',
          image: {
            src: '/HEADER.png',
            alt: 'Welcome',
          },
          upcoming: {
            label: 'Welcome',
            title: 'Join Our Community',
            date: 'Today',
            ctaLabel: 'Get Started',
            ctaTarget: '#join',
          },
          type: 'highlight' as const,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroData();
  }, [fetchHeroData]);

  return { slides, loading, error, refetch: fetchHeroData };
};
