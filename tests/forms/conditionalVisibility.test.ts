import { describe, expect, it } from 'vitest';

import type { PublicFormField } from '@/lib/apiTypes';
import {
  evaluateFieldRule,
  isFieldVisible,
} from '@/lib/forms/conditionalVisibility';
import { parseDDMM, toDDMM, splitE164 } from '@/lib/forms/fieldValue';

function field(overrides: Partial<PublicFormField>): PublicFormField {
  return {
    key: 'extra',
    label: 'Extra',
    type: 'text',
    required: false,
    order: 1,
    ...overrides,
  };
}

describe('evaluateFieldRule', () => {
  it('matches equals on scalars', () => {
    expect(evaluateFieldRule('Yes', 'equals', 'yes')).toBe(true);
    expect(evaluateFieldRule('No', 'equals', 'yes')).toBe(false);
  });

  it('matches contains for multi-select answers', () => {
    expect(evaluateFieldRule(['choir', 'ushering'], 'contains', 'choir')).toBe(
      true
    );
    expect(evaluateFieldRule(['choir'], 'not_contains', 'media')).toBe(true);
  });

  it('handles is_empty / not_empty', () => {
    expect(evaluateFieldRule('', 'is_empty')).toBe(true);
    expect(evaluateFieldRule('x', 'not_empty')).toBe(true);
  });
});

describe('isFieldVisible', () => {
  it('shows a field with no conditional', () => {
    expect(isFieldVisible(field({}), {})).toBe(true);
  });

  it('shows only when a show-rule matches', () => {
    const conditional = {
      mode: 'show' as const,
      match: 'all' as const,
      rules: [{ fieldKey: 'married', operator: 'equals', value: 'yes' }],
    };
    expect(isFieldVisible(field({ conditional }), { married: 'yes' })).toBe(
      true
    );
    expect(isFieldVisible(field({ conditional }), { married: 'no' })).toBe(
      false
    );
  });

  it('inverts for hide-mode', () => {
    const conditional = {
      mode: 'hide' as const,
      match: 'any' as const,
      rules: [{ fieldKey: 'role', operator: 'equals', value: 'guest' }],
    };
    expect(isFieldVisible(field({ conditional }), { role: 'guest' })).toBe(
      false
    );
    expect(isFieldVisible(field({ conditional }), { role: 'member' })).toBe(
      true
    );
  });
});

describe('date + phone helpers', () => {
  it('round-trips DD-MM', () => {
    expect(toDDMM('24', '12')).toBe('24-12');
    expect(parseDDMM('24-12')).toEqual({ day: '24', month: '12' });
    expect(parseDDMM('31-02')).toBeNull();
    expect(parseDDMM('nope')).toBeNull();
  });

  it('splits an E.164 number', () => {
    expect(splitE164('+2348012345678')).toEqual({
      country: 'NG',
      dial: '+234',
      national: '8012345678',
    });
    expect(splitE164('8012345678')).toBeNull();
  });
});
