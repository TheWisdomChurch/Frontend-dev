import { describe, expect, it } from 'vitest';

import type { PublicFormField } from '@/lib/apiTypes';
import {
  isFullDateField,
  parseDateParts,
  parseFullDate,
  toFullDate,
  daysInMonthForYear,
} from '@/lib/forms/fieldValue';

function dateField(
  mode?: 'full' | 'day-month',
  label = "Child's date of birth",
  key = 'child_date_of_birth'
): PublicFormField {
  return {
    key,
    label,
    type: 'date',
    required: true,
    order: 1,
    validation: mode ? { dateMode: mode } : undefined,
  };
}

describe('full-date helpers', () => {
  it('isFullDateField: explicit dateMode wins', () => {
    expect(isFullDateField(dateField('full'))).toBe(true);
    // "day-month" is an explicit override even for a birth-date label
    expect(isFullDateField(dateField('day-month', 'Date of Birth'))).toBe(
      false
    );
  });

  it('isFullDateField: birth-date fields auto-detect (keep the year)', () => {
    expect(isFullDateField(dateField(undefined, 'Date of Birth'))).toBe(true);
    expect(
      isFullDateField(dateField(undefined, "Child's D.O.B", 'child_dob'))
    ).toBe(true);
    expect(
      isFullDateField(dateField(undefined, 'Birth date', 'birthdate'))
    ).toBe(true);
  });

  it('isFullDateField: plain birthday / anniversary stay day+month', () => {
    expect(isFullDateField(dateField(undefined, 'Birthday', 'birthday'))).toBe(
      false
    );
    expect(
      isFullDateField(
        dateField(undefined, 'Wedding anniversary', 'anniversary')
      )
    ).toBe(false);
    expect(
      isFullDateField(dateField(undefined, 'Preferred date', 'preferred_date'))
    ).toBe(false);
  });

  it('parseDateParts reads DD-MM and DD-MM-YYYY', () => {
    expect(parseDateParts('05-09')).toEqual({
      day: '05',
      month: '09',
      year: '',
    });
    expect(parseDateParts('05-09-2016')).toEqual({
      day: '05',
      month: '09',
      year: '2016',
    });
    expect(parseDateParts('nonsense')).toBeNull();
  });

  it('toFullDate keeps partial selections and joins a complete one', () => {
    expect(toFullDate('', '', '')).toBe('');
    expect(toFullDate('05', '', '')).toBe('05-00-0000');
    expect(toFullDate('05', '09', '2016')).toBe('05-09-2016');
  });

  it('parseFullDate validates a complete, realistic date', () => {
    expect(parseFullDate('05-09-2016')).toEqual({
      day: 5,
      month: 9,
      year: 2016,
    });
    expect(parseFullDate('05-09')).toBeNull(); // no year
    expect(parseFullDate('31-02-2016')).toBeNull(); // Feb 31
    expect(parseFullDate('05-09-1850')).toBeNull(); // year too old
  });

  it('daysInMonthForYear handles leap years', () => {
    expect(daysInMonthForYear(2, 2016)).toBe(29);
    expect(daysInMonthForYear(2, 2017)).toBe(28);
    expect(daysInMonthForYear(2, 2100)).toBe(28);
    expect(daysInMonthForYear(2)).toBe(29); // unknown year → allow 29
    expect(daysInMonthForYear(4, 2020)).toBe(30);
  });
});
