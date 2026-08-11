import { describe, expect, it } from 'vitest';

import {
  classifySundayService,
  getUpcomingSundayServices,
} from '@/lib/serviceCalendar';

describe('Sunday service calendar', () => {
  it.each([
    ['2026-03-01T12:00:00', 'Celebration & Communion Service'],
    ['2026-03-08T12:00:00', 'Gaining Wisdom Service'],
    ['2026-03-15T12:00:00', 'Gaining Wisdom Service'],
    ['2026-03-22T12:00:00', 'Gaining Wisdom Service'],
    ['2026-03-29T12:00:00', 'Supernatural Service'],
  ])('classifies %s', (raw, expected) => {
    expect(classifySundayService(new Date(raw))).toBe(expected);
  });

  it('returns consecutive Sundays with backend-compatible dates', () => {
    const services = getUpcomingSundayServices(
      new Date('2026-03-02T12:00:00'),
      4
    );
    expect(services.map(service => service.value)).toEqual([
      '2026-03-08',
      '2026-03-15',
      '2026-03-22',
      '2026-03-29',
    ]);
  });
});
