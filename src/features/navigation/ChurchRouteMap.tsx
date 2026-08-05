'use client';

import { useEffect, useRef, useState } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

import type { Coordinates } from '@/domain/navigation/directions';

let configuredKey: string | undefined;

function configureMaps(key: string) {
  if (configuredKey) return;
  configuredKey = key;
  setOptions({
    key,
    v: 'weekly',
    language: 'en',
    region: 'NG',
    authReferrerPolicy: 'origin',
  });
}

export default function ChurchRouteMap({
  origin,
  encodedPolyline,
}: {
  origin: Coordinates;
  encodedPolyline: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const browserKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_API_KEY;

  useEffect(() => {
    if (!browserKey || !containerRef.current || !encodedPolyline) return;
    let active = true;
    let map: google.maps.Map | undefined;

    configureMaps(browserKey);

    Promise.all([importLibrary('maps'), importLibrary('geometry')])
      .then(([{ Map }, { encoding }]) => {
        if (!active || !containerRef.current) return;
        const path = encoding.decodePath(encodedPolyline);
        if (path.length === 0) throw new Error('Route geometry is empty');
        const originPosition = {
          lat: origin.latitude,
          lng: origin.longitude,
        };

        map = new Map(containerRef.current, {
          center: originPosition,
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          gestureHandling: 'greedy',
          clickableIcons: false,
        });

        new google.maps.Polyline({
          map,
          path,
          strokeColor: '#c9961a',
          strokeOpacity: 1,
          strokeWeight: 6,
        });

        new google.maps.Marker({
          map,
          position: originPosition,
          title: 'Your location',
          label: { text: 'A', color: '#ffffff', fontWeight: '700' },
        });
        new google.maps.Marker({
          map,
          position: path[path.length - 1]!,
          title: 'The Wisdom Church',
          label: { text: 'W', color: '#ffffff', fontWeight: '700' },
        });

        const bounds = new google.maps.LatLngBounds();
        path.forEach(point => bounds.extend(point));
        map.fitBounds(bounds, 52);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
      map = undefined;
    };
  }, [browserKey, encodedPolyline, origin]);

  if (!browserKey) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-[#ede9df] p-8 text-center font-ui text-sm text-black/65">
        The secure route is ready. Configure the browser-restricted Maps key to
        display the interactive map.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-[#ede9df] p-8 text-center font-ui text-sm text-black/65">
        The map could not load. You can still continue with turn-by-turn
        navigation.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[320px] w-full bg-[#ede9df]"
      aria-label="Driving route from your location to The Wisdom Church"
    />
  );
}
