import type { Metadata } from 'next';

import { buildSermonDiscovery, mediaApi } from '@/domain/media/api';
import type { YouTubeVideo } from '@/domain/media/types';
import SermonLibrary from '@/features/resources/Sermons/SermonLibrary';
import JsonLd from '@/shared/seo/JsonLd';
import {
  buildBreadcrumbSchema,
  buildPageMetadata,
  buildVideoSchema,
  canonicalUrl,
} from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Sermons & Teachings',
  description:
    'Watch and listen to the latest sermons, messages, and teaching series from The Wisdom Church, Lagos — new messages every week.',
  path: '/resources/sermons',
  keywords: [
    'sermons Lagos',
    'The Wisdom Church sermons',
    'Wisdom Church sermons',
    'watch sermons online',
    'Christian teaching Nigeria',
    'bible teaching video',
    'church messages Lagos',
  ],
});

export const revalidate = 300;

export default async function SermonsPage() {
  const result = await mediaApi
    .getSermonDiscovery()
    .then(discovery => ({
      discovery,
      unavailable: false as const,
      source: 'discovery' as const,
    }))
    .catch(async () => {
      try {
        const sermons = await mediaApi.listSermons({
          sort: 'newest',
          limit: 50,
        });
        return {
          discovery: buildSermonDiscovery(sermons),
          unavailable: sermons.length === 0,
          source: 'legacy' as const,
        };
      } catch {
        return {
          discovery: buildSermonDiscovery([]),
          unavailable: true as const,
          source: 'offline' as const,
        };
      }
    });

  const { discovery } = result;
  const videoPool: YouTubeVideo[] = [
    ...(discovery.featured ? [discovery.featured] : []),
    ...discovery.latest,
  ]
    .filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i)
    .filter(v => v.id && v.publishedAt)
    .slice(0, 12);

  const videoListSchema =
    videoPool.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Sermons & Teachings — The Wisdom Church',
          url: canonicalUrl('/resources/sermons'),
          itemListElement: videoPool.map((v, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: buildVideoSchema({
              name: v.title,
              description: v.description,
              thumbnailUrl: v.thumbnail || v.thumbnails?.medium?.url,
              uploadDate: v.publishedAt,
              duration: v.duration,
              contentUrl: v.url,
              embedUrl: v.embedUrl,
              viewCount: v.viewCount,
            }),
          })),
        }
      : null;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
          { name: 'Sermons', path: '/resources/sermons' },
        ])}
      />
      {videoListSchema ? <JsonLd data={videoListSchema} /> : null}
      <SermonLibrary
        discovery={result.discovery}
        unavailable={result.unavailable}
        source={result.source}
      />
    </>
  );
}
