import type { Coordinates } from './directions';

export type RoutePreviewRequest = Readonly<{ origin: Coordinates }>;

export type RoutePreview = Readonly<{
  distanceMeters: number;
  durationSeconds: number;
  distanceLabel: string;
  durationLabel: string;
}>;
