import { describe, expect, it } from 'vitest';

import {
  buildDrivingDirectionsUrl,
  isValidCoordinates,
} from '../../src/domain/navigation/directions';

describe('driving directions', () => {
  it('builds turn-by-turn driving directions from a live origin', () => {
    const url = new URL(
      buildDrivingDirectionsUrl({
        destination: 'Honor Gardens, Lagos, Nigeria',
        destinationPlaceId: 'verified-place-id',
        origin: { latitude: 6.4698, longitude: 3.5852 },
      })
    );

    expect(url.origin).toBe('https://www.google.com');
    expect(url.searchParams.get('origin')).toBe('6.4698,3.5852');
    expect(url.searchParams.get('destination')).toBe(
      'Honor Gardens, Lagos, Nigeria'
    );
    expect(url.searchParams.get('destination_place_id')).toBe(
      'verified-place-id'
    );
    expect(url.searchParams.get('travelmode')).toBe('driving');
    expect(url.searchParams.get('dir_action')).toBe('navigate');
  });

  it('supports a maps-managed current-location fallback', () => {
    const url = new URL(
      buildDrivingDirectionsUrl({ destination: 'The Wisdom Church, Lagos' })
    );

    expect(url.searchParams.has('origin')).toBe(false);
    expect(url.searchParams.has('destination_place_id')).toBe(false);
  });

  it('rejects coordinates outside valid geographic ranges', () => {
    expect(isValidCoordinates({ latitude: 6.5, longitude: 3.4 })).toBe(true);
    expect(isValidCoordinates({ latitude: 91, longitude: 3.4 })).toBe(false);
    expect(isValidCoordinates({ latitude: 6.5, longitude: -181 })).toBe(false);
  });
});
