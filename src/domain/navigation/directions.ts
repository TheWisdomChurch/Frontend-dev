export type Coordinates = Readonly<{
  latitude: number;
  longitude: number;
}>;

type DrivingDirectionsOptions = Readonly<{
  destination: string;
  destinationPlaceId?: string;
  origin?: Coordinates;
}>;

const GOOGLE_MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1';

function isValidCoordinate(value: number, minimum: number, maximum: number) {
  return Number.isFinite(value) && value >= minimum && value <= maximum;
}

export function isValidCoordinates(origin: Coordinates) {
  return (
    isValidCoordinate(origin.latitude, -90, 90) &&
    isValidCoordinate(origin.longitude, -180, 180)
  );
}

export function buildDrivingDirectionsUrl({
  destination,
  destinationPlaceId,
  origin,
}: DrivingDirectionsOptions) {
  const url = new URL(GOOGLE_MAPS_DIRECTIONS_URL);
  url.searchParams.set('destination', destination);
  url.searchParams.set('travelmode', 'driving');
  url.searchParams.set('dir_action', 'navigate');

  if (destinationPlaceId?.trim()) {
    url.searchParams.set('destination_place_id', destinationPlaceId.trim());
  }

  if (origin && isValidCoordinates(origin)) {
    url.searchParams.set('origin', `${origin.latitude},${origin.longitude}`);
  }

  return url.toString();
}
