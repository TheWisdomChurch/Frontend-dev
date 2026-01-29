/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getAllChannelVideos } from '@/lib/youtube';
import { YouTubeVideo } from '@/lib/types';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

// Cache for better performance
let cachedVideos: YouTubeVideo[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in-memory
const DISK_CACHE_PATH = '/tmp/sermons-cache.json';
const DISK_CACHE_MAX_AGE = 1000 * 60 * 60 * 24; // 24h
const MAX_FETCH = 200;
let fetchPromise: Promise<YouTubeVideo[]> | null = null;

async function readDiskCache(): Promise<YouTubeVideo[] | null> {
  try {
    const raw = await fs.readFile(DISK_CACHE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as { ts: number; data: YouTubeVideo[] };
    if (Date.now() - parsed.ts < DISK_CACHE_MAX_AGE) {
      cacheTimestamp = parsed.ts;
      return parsed.data;
    }
    return null;
  } catch {
    return null;
  }
}

async function writeDiskCache(data: YouTubeVideo[]) {
  try {
    const payload = { ts: Date.now(), data };
    await fs.writeFile(DISK_CACHE_PATH, JSON.stringify(payload), 'utf-8');
  } catch {
    // ignore disk write errors
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const series = searchParams.get('series') || 'all';
    const preacher = searchParams.get('preacher') || 'all';
    const sort = searchParams.get('sort') || 'newest';

    const now = Date.now();
    let videos: YouTubeVideo[];

    if (cachedVideos && now - cacheTimestamp <= CACHE_DURATION) {
      videos = cachedVideos;
    } else {
      if (!cachedVideos) {
        const disk = await readDiskCache();
        if (disk) {
          cachedVideos = disk;
        }
      }

      if (cachedVideos && now - cacheTimestamp <= CACHE_DURATION) {
        videos = cachedVideos;
      } else {
        if (!fetchPromise) {
          fetchPromise = getAllChannelVideos(MAX_FETCH)
            .then(v => {
              cacheTimestamp = Date.now();
              cachedVideos = v;
              writeDiskCache(v);
              fetchPromise = null;
              return v;
            })
            .catch(error => {
              fetchPromise = null;
              throw error;
            });
        }
        videos = await fetchPromise;
      }
    }

    let filteredVideos = [...videos];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVideos = filteredVideos.filter(
        video =>
          video.title.toLowerCase().includes(searchLower) ||
          video.description.toLowerCase().includes(searchLower) ||
          video.series.toLowerCase().includes(searchLower) ||
          video.preacher.toLowerCase().includes(searchLower)
      );
    }

    // Apply series filter
    if (series !== 'all') {
      filteredVideos = filteredVideos.filter(video =>
        video.series.toLowerCase().includes(series.toLowerCase())
      );
    }

    // Apply preacher filter
    if (preacher !== 'all') {
      filteredVideos = filteredVideos.filter(video =>
        video.preacher.toLowerCase().includes(preacher.toLowerCase())
      );
    }

    // Apply sorting
    switch (sort) {
      case 'oldest':
        filteredVideos.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
        );
        break;
      case 'popular':
        filteredVideos.sort(
          (a, b) => parseInt(b.viewCount) - parseInt(a.viewCount)
        );
        break;
      case 'newest':
      default:
        // Already sorted by newest by default
        break;
    }

    // Create response with headers
    const response = NextResponse.json(filteredVideos);

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, OPTIONS, POST, PUT, DELETE'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    // Set cache headers
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=1800, stale-while-revalidate=3600'
    );

    return response;
  } catch (error) {
    console.error('API Error:', error);

    const errorResponse = NextResponse.json(
      {
        message: 'Error fetching sermons',
        error: (error as Error).message,
      },
      { status: 500 }
    );

    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    return errorResponse;
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, OPTIONS, POST, PUT, DELETE'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  return response;
}
