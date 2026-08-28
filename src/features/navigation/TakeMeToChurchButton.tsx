'use client';

import { useCallback, useId, useRef, useState } from 'react';
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
import { buttonClass } from '@/shared/ui/button';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import ChurchRouteMap from './ChurchRouteMap';
import { BaseModal } from '@/shared/ui/modals/Modal';

type NavigationState = 'idle' | 'locating' | 'preview' | 'recovery';
type LocationFailure = 'permission_denied' | 'timeout' | 'position_unavailable';

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 8_000,
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
  const [failure, setFailure] = useState<LocationFailure>(
    'position_unavailable'
  );
  const requestInFlight = useRef(false);
  const requestSequence = useRef(0);
  const statusId = useId();
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
    const requestId = ++requestSequence.current;
    setState('locating');

    navigator.geolocation.getCurrentPosition(
      async position => {
        if (requestId !== requestSequence.current) return;
        requestInFlight.current = false;
        const currentOrigin = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setOrigin(currentOrigin);

        try {
          const route = await getRoutePreview({ origin: currentOrigin });
          if (requestId !== requestSequence.current) return;
          setPreview(route);
          setState('preview');
          trackEvent('church_route_previewed', {
            distance_meters: route.distanceMeters,
            duration_seconds: route.durationSeconds,
          });
        } catch {
          if (requestId !== requestSequence.current) return;
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
        if (requestId !== requestSequence.current) return;
        requestInFlight.current = false;
        const reason =
          error.code === error.PERMISSION_DENIED
            ? 'permission_denied'
            : error.code === error.TIMEOUT
              ? 'timeout'
              : 'position_unavailable';
        setFailure(reason);
        setState('recovery');
        trackEvent('church_directions_location_unavailable', {
          reason,
        });
      },
      GEOLOCATION_OPTIONS
    );
  }, [trackEvent]);

  const useMapsFallback = useCallback(() => {
    requestSequence.current += 1;
    requestInFlight.current = false;
    trackEvent('church_directions_opened', {
      location_source: 'maps_fallback',
    });
    openDirections();
  }, [trackEvent]);

  const closeFlow = useCallback(() => {
    requestSequence.current += 1;
    requestInFlight.current = false;
    setState('idle');
  }, []);

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
        aria-describedby={state === 'locating' ? statusId : undefined}
        className={buttonClass(
          'dark',
          'md',
          cn('min-w-0 whitespace-normal', fullWidth && 'w-full')
        )}
      >
        {state === 'locating' ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Navigation className="h-4 w-4 fill-current" aria-hidden="true" />
        )}
        {state === 'locating' ? 'Finding your location…' : 'Take me to church'}
      </button>

      {state === 'locating' ? (
        <p
          id={statusId}
          role="status"
          className="mt-2 text-center font-ui text-xs leading-5 text-black/60 sm:text-left"
        >
          Checking the fastest route.{' '}
          <button
            type="button"
            onClick={useMapsFallback}
            className="font-bold underline decoration-2 underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            Open Maps now
          </button>
        </p>
      ) : null}

      <BaseModal
        isOpen={state === 'preview' && Boolean(preview && origin)}
        onClose={closeFlow}
        maxWidth="max-w-6xl"
        tone="light"
        contentClassName="!p-0"
        ariaLabel="Route to The Wisdom Church"
      >
        {preview && origin ? (
          <div className="grid min-h-0 w-full overflow-hidden bg-white lg:h-[min(760px,88svh)] lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="relative min-h-[45vh] lg:min-h-0">
              <ChurchRouteMap
                origin={origin}
                encodedPolyline={preview.encodedPolyline}
              />
              <button
                type="button"
                onClick={closeFlow}
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
                  onClick={closeFlow}
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

              <div className="mt-6 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2">
                <div className="rounded-card bg-[var(--app-canvas-2)] p-4">
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
                <div className="rounded-card bg-[var(--app-canvas-2)] p-4">
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
                className={buttonClass('dark', 'md', 'mt-4 w-full')}
              >
                <Navigation
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                />
                Start turn-by-turn navigation
              </button>
            </div>
          </div>
        ) : null}
      </BaseModal>

      <BaseModal
        isOpen={state === 'recovery'}
        onClose={closeFlow}
        title="Let’s still get you there"
        subtitle="Location access is optional. You can open the church directly in Maps without sharing your position with this website."
        maxWidth="max-w-md"
        forceBottomSheet
      >
        <div className="min-w-0">
          <div className="flex items-start gap-3 rounded-card border border-[var(--status-warning)]/15 bg-[var(--status-warning)]/[0.06] p-4">
            <LocateFixed className="mt-0.5 h-5 w-5 shrink-0 text-[var(--app-primary)]" />
            <p className="font-ui text-sm leading-6 text-white/62">
              {failure === 'permission_denied'
                ? 'Location permission was not granted. You can change it in your browser settings or continue without it.'
                : failure === 'timeout'
                  ? 'Your location took too long to respond. This can happen indoors or on a slow connection.'
                  : 'Your device could not determine its current location.'}
            </p>
          </div>
          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={useMapsFallback}
              className={buttonClass('primary')}
            >
              <Navigation className="h-4 w-4 fill-current" /> Open directions in
              Maps
            </button>
            {failure !== 'permission_denied' ? (
              <button
                type="button"
                onClick={startNavigation}
                className="min-h-12 rounded-full border border-white/12 px-5 py-3 font-ui text-sm font-bold text-white transition hover:bg-white/[0.06]"
              >
                Try location again
              </button>
            ) : null}
          </div>
          <p className="mt-4 break-words text-center font-ui text-xs leading-5 text-white/40">
            Destination: {SERVICE_INFO.venue.full}
          </p>
        </div>
      </BaseModal>
    </div>
  );
}
