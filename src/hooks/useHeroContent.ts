'use client';

import { useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api';
import type { EventPublic, ReelPublic } from '@/lib/apiTypes';
import { useApiQuery } from './useApiQuery';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image: {
    src: string | null;
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
      src: event.imageUrl || event.bannerUrl || null,
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
      src: reel.thumbnailUrl || null,
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

export const useHeroContent = () => {
  const query = useCallback(async (signal: AbortSignal) => {
    const results = await Promise.allSettled([
      apiClient.listEvents(signal),
      apiClient.listReels(signal),
    ]);
    if (signal.aborted)
      throw new DOMException('Request cancelled', 'AbortError');

    const events = results[0].status === 'fulfilled' ? results[0].value : [];
    const reels = results[1].status === 'fulfilled' ? results[1].value : [];
    if (results.every(result => result.status === 'rejected')) {
      throw results[0].status === 'rejected'
        ? results[0].reason
        : new Error('Failed to load hero content');
    }
    return { events, reels };
  }, []);

  const result = useApiQuery(query);
  const slides = useMemo(() => {
    const events: EventPublic[] = result.data?.events ?? [];
    const reels: ReelPublic[] = result.data?.reels ?? [];
    const upcomingEvents = events
      .filter(event => {
        if (!event.startAt) return false;
        const date = new Date(event.startAt);
        return !Number.isNaN(date.getTime()) && date > new Date();
      })
      .slice(0, 3)
      .map(mapEventToHeroSlide);
    return [...upcomingEvents, ...reels.slice(0, 2).map(mapReelToHeroSlide)];
  }, [result.data]);

  return {
    slides,
    loading: result.isLoading,
    error: result.error?.message ?? null,
    refetch: result.refetch,
  };
};
