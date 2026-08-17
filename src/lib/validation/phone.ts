import { Country } from 'country-state-city';
import {
  getCountryCallingCode,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';
import { z } from 'zod';

export type PhoneCountry = {
  iso: CountryCode;
  name: string;
  /** Display dial code, e.g. "+234" — sourced from libphonenumber-js
   * rather than country-state-city, which has messy multi-area-code
   * strings ("+1-809 and 1-829") for some territories. */
  dial: string;
};

// The church's primary regions surface first in the dropdown; everything
// else follows alphabetically rather than by raw calling-code order.
const PRIORITY_ISO_ORDER: CountryCode[] = [
  'NG',
  'GH',
  'GB',
  'US',
  'CA',
  'ZA',
  'KE',
];

export const PHONE_COUNTRIES: PhoneCountry[] = Country.getAllCountries()
  .filter((c): c is typeof c & { isoCode: CountryCode } =>
    isSupportedCountry(c.isoCode)
  )
  .map(c => ({
    iso: c.isoCode,
    name: c.name,
    dial: `+${getCountryCallingCode(c.isoCode)}`,
  }))
  .sort((a, b) => {
    const ai = PRIORITY_ISO_ORDER.indexOf(a.iso);
    const bi = PRIORITY_ISO_ORDER.indexOf(b.iso);
    if (ai !== -1 || bi !== -1) {
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    }
    return a.name.localeCompare(b.name);
  });

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'NG';

export function splitPhoneNumber(
  value: string,
  fallbackCountry: CountryCode = DEFAULT_PHONE_COUNTRY
): { country: CountryCode; number: string } {
  const parsed = parsePhoneNumberFromString(value || '', fallbackCountry);
  if (parsed?.country) {
    return { country: parsed.country, number: parsed.nationalNumber };
  }
  return {
    country: fallbackCountry,
    number: value.replace(/\D/g, ''),
  };
}

/** True only for a number that's actually valid for the given country —
 * correct length, correct leading digits, digits only. Rejects letters,
 * too-short/too-long numbers, and numbers that don't match the country's
 * real numbering plan (not just "is it 7+ characters"). */
export function isValidNationalPhone(
  nationalNumber: string,
  countryIso: string
): boolean {
  if (!nationalNumber.trim()) return false;
  if (!isSupportedCountry(countryIso)) return false;
  try {
    return isValidPhoneNumber(nationalNumber, countryIso as CountryCode);
  } catch {
    return false;
  }
}

/** Combines a country + local number into one E.164 string (e.g.
 * "+2348031234567") for backends that store a single phone field. Returns
 * null if the number isn't valid for the selected country. */
export function toE164(
  nationalNumber: string,
  countryIso: string
): string | null {
  if (!isSupportedCountry(countryIso)) return null;
  const parsed = parsePhoneNumberFromString(
    nationalNumber,
    countryIso as CountryCode
  );
  return parsed && parsed.isValid() ? parsed.number : null;
}

/** Zod schema for a { country, number } pair, for forms already using
 * react-hook-form + zod (e.g. the Workforce registration form). */
export const phoneFieldSchema = z
  .object({
    country: z.string().min(2, 'Select a country'),
    number: z.string().min(1, 'Phone number is required'),
  })
  .refine(v => isValidNationalPhone(v.number, v.country), {
    message: 'Enter a valid phone number for the selected country',
    path: ['number'],
  });
