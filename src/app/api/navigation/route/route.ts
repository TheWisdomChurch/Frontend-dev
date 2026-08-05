import { NextRequest, NextResponse } from 'next/server';

import { isValidCoordinates } from '@/domain/navigation/directions';
import type { RoutePreview } from '@/domain/navigation/types';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GOOGLE_ROUTES_URL =
  'https://routes.googleapis.com/directions/v2:computeRoutes';
const FIELD_MASK =
  'routes.distanceMeters,routes.duration,routes.localizedValues.distance.text,routes.localizedValues.duration.text';

type GoogleRoutesResponse = {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
    localizedValues?: {
      distance?: { text?: string };
      duration?: { text?: string };
    };
  }>;
  error?: { message?: string };
};

function secondsFromGoogleDuration(value?: string) {
  if (!value || !/^\d+(?:\.\d+)?s$/.test(value)) return 0;
  return Math.round(Number.parseFloat(value.slice(0, -1)));
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { message },
    { status, headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_MAPS_ROUTES_API_KEY?.trim();
  if (!apiKey) {
    return errorResponse('Traffic-aware routing is not configured.', 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid navigation request.', 400);
  }

  const origin =
    body && typeof body === 'object' && 'origin' in body
      ? (body.origin as { latitude?: unknown; longitude?: unknown })
      : null;
  const coordinates = {
    latitude: typeof origin?.latitude === 'number' ? origin.latitude : NaN,
    longitude: typeof origin?.longitude === 'number' ? origin.longitude : NaN,
  };

  if (!isValidCoordinates(coordinates)) {
    return errorResponse('Valid origin coordinates are required.', 400);
  }

  try {
    const response = await fetch(GOOGLE_ROUTES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify({
        origin: { location: { latLng: coordinates } },
        destination: { address: SERVICE_INFO.venue.full },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        languageCode: 'en',
        units: 'METRIC',
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(12_000),
    });
    const payload = (await response.json()) as GoogleRoutesResponse;
    const route = payload.routes?.[0];

    if (!response.ok || !route) {
      return errorResponse('A driving route could not be calculated.', 502);
    }

    const result: RoutePreview = {
      distanceMeters: route.distanceMeters ?? 0,
      durationSeconds: secondsFromGoogleDuration(route.duration),
      distanceLabel: route.localizedValues?.distance?.text ?? 'Route available',
      durationLabel: route.localizedValues?.duration?.text ?? 'ETA available',
    };

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return errorResponse(
      'The navigation service is temporarily unavailable.',
      502
    );
  }
}
