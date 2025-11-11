/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getAllChannelVideos } from '@/lib/youtube';
import { YouTubeVideo } from '@/lib/types';

// Cache for better performance
let cachedVideos: YouTubeVideo[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
let fetchPromise: Promise<YouTubeVideo[]> | null = null;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const series = searchParams.get('series') || 'all';
    const preacher = searchParams.get('preacher') || 'all';
    const sort = searchParams.get('sort') || 'newest';

    console.log('Fetching sermons with filters:', {
      search,
      series,
      preacher,
      sort,
    });

    const now = Date.now();
    let videos: YouTubeVideo[];

    if (cachedVideos && now - cacheTimestamp <= CACHE_DURATION) {
      console.log('Using cached videos');
      videos = cachedVideos;
    } else {
      if (!fetchPromise) {
        console.log('Starting new fetch');
        fetchPromise = getAllChannelVideos(600)
          .then(v => {
            cacheTimestamp = Date.now();
            fetchPromise = null;
            return v;
          })
          .catch(error => {
            fetchPromise = null;
            throw error;
          });
      } else {
        console.log('Waiting for ongoing fetch');
      }
      videos = await fetchPromise;
      cachedVideos = videos;
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

    console.log(`Returning ${filteredVideos.length} filtered videos`);

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
      'public, s-maxage=300, stale-while-revalidate=600'
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
