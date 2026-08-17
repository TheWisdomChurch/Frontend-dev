import { describe, expect, it } from 'vitest';

import { HOME_NEXT_STEPS, HOME_SECONDARY_STEPS } from '@/features/home/journey';

describe('homepage visitor journey', () => {
  it('offers a small set of distinct, task-specific next steps', () => {
    expect(HOME_NEXT_STEPS).toHaveLength(3);
    expect(new Set(HOME_NEXT_STEPS.map(step => step.href)).size).toBe(
      HOME_NEXT_STEPS.length
    );
    expect(HOME_NEXT_STEPS.map(step => step.href)).toEqual([
      '/resources/sermons',
      '/ministries',
      '/contact',
    ]);
  });

  it('keeps member-specific actions available without crowding the primary journey', () => {
    expect(HOME_SECONDARY_STEPS.map(step => step.href)).toEqual([
      '/serve',
      '/giving',
      '/pastoral',
    ]);
  });

  it('uses descriptive labels instead of generic calls to action', () => {
    const genericLabels = new Set(['continue', 'learn more', 'get started']);
    for (const step of HOME_NEXT_STEPS) {
      expect(genericLabels.has(step.title.toLowerCase())).toBe(false);
      expect(step.description.length).toBeGreaterThan(20);
    }
  });
});
