import type { Metadata } from 'next';

import { buildSermonDiscovery, mediaApi } from '@/domain/media/api';
import SermonLibrary from '@/features/resources/Sermons/SermonLibrary';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Sermons & Teachings',
  description:
    'Watch the latest sermons and teaching series from The Wisdom Church.',
  path: '/resources/sermons',
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

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
          { name: 'Sermons', path: '/resources/sermons' },
        ])}
      />
      <SermonLibrary
        discovery={result.discovery}
        unavailable={result.unavailable}
        source={result.source}
      />
    </>
  );
}
