'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Clock3,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Navigation,
  X,
} from 'lucide-react';

import { getRoutePreview } from '@/domain/navigation/api';
import { buildDrivingDirectionsUrl } from '@/domain/navigation/directions';
import type { Coordinates } from '@/domain/navigation/directions';
import type { RoutePreview } from '@/domain/navigation/types';
import { cn } from '@/lib/cn';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import ChurchRouteMap from './ChurchRouteMap';

type NavigationState = 'idle' | 'locating' | 'preview' | 'error';

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 12_000,
  maximumAge: 60_000,
};

function openDirections(origin?: Coordinates) {
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
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  const [state, setState] = useState<NavigationState>('idle');
  const [origin, setOrigin] = useState<Coordinates>();
  const [preview, setPreview] = useState<RoutePreview>();
  const requestInFlight = useRef(false);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (state !== 'preview') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setState('idle');
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [state]);

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
      async position => {
        requestInFlight.current = false;
        const currentOrigin = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setOrigin(currentOrigin);

        try {
          const route = await getRoutePreview({ origin: currentOrigin });
          setPreview(route);
          setState('preview');
          trackEvent('church_route_previewed', {
            distance_meters: route.distanceMeters,
            duration_seconds: route.durationSeconds,
          });
        } catch {
          // Maps can still calculate the route even if our traffic preview API
          // is unavailable or has not yet been configured.
          trackEvent('church_directions_opened', {
            location_source: 'browser_geolocation',
            preview_status: 'unavailable',
          });
          openDirections(position.coords);
        }
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

  const beginTurnByTurnNavigation = useCallback(() => {
    trackEvent('church_directions_opened', {
      location_source: 'browser_geolocation',
      preview_status: 'shown',
    });
    openDirections(origin);
  }, [origin, trackEvent]);

  return (
    <div
      className={cn(
        'flex flex-col items-center sm:items-start',
        fullWidth && 'w-full',
        className
      )}
    >
      <button
        type="button"
        onClick={startNavigation}
        disabled={state === 'locating'}
        aria-describedby={
          state === 'error' ? 'church-directions-status' : undefined
        }
        className={cn(
          'group inline-flex min-h-12 items-center gap-2 rounded-full border border-black bg-black px-4 font-ui text-xs font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 disabled:cursor-wait disabled:opacity-75 sm:gap-3 sm:px-5 sm:text-sm',
          fullWidth && 'w-full justify-center'
        )}
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

      {state === 'preview' && preview && origin && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="church-route-title"
          className="fixed inset-0 z-[10000] flex bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
        >
          <div className="grid h-full w-full overflow-hidden bg-white shadow-2xl sm:h-[min(780px,90vh)] sm:max-w-6xl sm:rounded-3xl lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="relative min-h-[45vh] lg:min-h-0">
              <ChurchRouteMap
                origin={origin}
                encodedPolyline={preview.encodedPolyline}
              />
              <button
                type="button"
                onClick={() => setState('idle')}
                aria-label="Close route planner"
                className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 lg:hidden"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col bg-white p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-ui text-xs font-bold uppercase tracking-[0.16em] text-[var(--app-primary-dark)]">
                    Live route planner
                  </p>
                  <h2
                    id="church-route-title"
                    className="mt-2 font-sans text-3xl font-black uppercase leading-none tracking-[-0.035em] text-black"
                  >
                    Take me to church
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setState('idle')}
                  aria-label="Close route planner"
                  className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 lg:inline-flex"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <p className="mt-5 font-ui text-sm leading-6 text-black/60">
                Fastest available driving route to {SERVICE_INFO.venue.name},
                calculated using current traffic.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f4f1e9] p-4">
                  <Clock3
                    className="h-5 w-5 text-[var(--app-primary-dark)]"
                    aria-hidden="true"
                  />
                  <strong className="mt-3 block font-ui text-xl text-black">
                    {preview.durationLabel}
                  </strong>
                  <span className="font-ui text-xs text-black/50">
                    Estimated time
                  </span>
                </div>
                <div className="rounded-2xl bg-[#f4f1e9] p-4">
                  <MapPin
                    className="h-5 w-5 text-[var(--app-primary-dark)]"
                    aria-hidden="true"
                  />
                  <strong className="mt-3 block font-ui text-xl text-black">
                    {preview.distanceLabel}
                  </strong>
                  <span className="font-ui text-xs text-black/50">
                    Driving distance
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-black/10 pt-5">
                <p className="font-ui text-xs font-bold uppercase tracking-[0.14em] text-black/45">
                  Destination
                </p>
                <p className="mt-2 font-ui text-sm font-semibold leading-6 text-black">
                  {SERVICE_INFO.venue.full}
                </p>
              </div>

              <p className="mt-auto pt-6 font-ui text-xs leading-5 text-black/45">
                Your location is used only to calculate this route and is not
                saved by The Wisdom Church.
              </p>

              <button
                type="button"
                onClick={beginTurnByTurnNavigation}
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 font-ui text-sm font-bold text-white transition hover:bg-[var(--app-primary-dark)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20"
              >
                <Navigation
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                />
                Start turn-by-turn navigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
