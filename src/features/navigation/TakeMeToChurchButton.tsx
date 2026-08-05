'use client';

import { useCallback, useRef, useState } from 'react';
import { LoaderCircle, LocateFixed, Navigation } from 'lucide-react';

import { buildDrivingDirectionsUrl } from '@/domain/navigation/directions';
import { cn } from '@/lib/cn';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';

type NavigationState = 'idle' | 'locating' | 'error';

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 12_000,
  maximumAge: 60_000,
};

function openDirections(origin?: GeolocationCoordinates) {
  const url = buildDrivingDirectionsUrl({
    destination: SERVICE_INFO.venue.full,
    destinationPlaceId: SERVICE_INFO.venue.googlePlaceId,
    origin: origin
      ? { latitude: origin.latitude, longitude: origin.longitude }
      : undefined,
  });

  // Same-tab navigation avoids popup blockers and lets the Google Maps
  // universal link hand off to an installed maps app on supported devices.
  window.location.assign(url);
}

export default function TakeMeToChurchButton({
  className,
}: {
  className?: string;
}) {
  const [state, setState] = useState<NavigationState>('idle');
  const requestInFlight = useRef(false);
  const { trackEvent } = useAnalytics();

  const startNavigation = useCallback(() => {
    if (requestInFlight.current) return;

    trackEvent('church_directions_requested', {
      destination: SERVICE_INFO.venue.short,
      travel_mode: 'driving',
    });

    if (!window.isSecureContext || !navigator.geolocation) {
      trackEvent('church_directions_opened', {
        location_source: 'maps_fallback',
      });
      openDirections();
      return;
    }

    requestInFlight.current = true;
    setState('locating');

    navigator.geolocation.getCurrentPosition(
      position => {
        requestInFlight.current = false;
        trackEvent('church_directions_opened', {
          location_source: 'browser_geolocation',
        });
        openDirections(position.coords);
      },
      error => {
        requestInFlight.current = false;
        setState('error');
        trackEvent('church_directions_location_unavailable', {
          reason:
            error.code === error.PERMISSION_DENIED
              ? 'permission_denied'
              : error.code === error.TIMEOUT
                ? 'timeout'
                : 'position_unavailable',
        });
      },
      GEOLOCATION_OPTIONS
    );
  }, [trackEvent]);

  const useMapsFallback = useCallback(() => {
    trackEvent('church_directions_opened', {
      location_source: 'maps_fallback',
    });
    openDirections();
  }, [trackEvent]);

  return (
    <div className={cn('flex flex-col items-center sm:items-start', className)}>
      <button
        type="button"
        onClick={startNavigation}
        disabled={state === 'locating'}
        aria-describedby={
          state === 'error' ? 'church-directions-status' : undefined
        }
        className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-black bg-black px-5 font-ui text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 disabled:cursor-wait disabled:opacity-75"
      >
        {state === 'locating' ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Navigation className="h-4 w-4 fill-current" aria-hidden="true" />
        )}
        {state === 'locating' ? 'Finding your location…' : 'Take me to church'}
      </button>

      {state === 'error' && (
        <p
          id="church-directions-status"
          role="status"
          className="mt-3 max-w-sm font-ui text-sm leading-6 text-black/70"
        >
          We couldn&apos;t access your location. Enable location permission, or{' '}
          <button
            type="button"
            onClick={useMapsFallback}
            className="inline-flex items-center gap-1 font-bold underline decoration-2 underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
            open Maps anyway
          </button>
          .
        </p>
      )}
    </div>
  );
}
