import type { CountryCode } from 'libphonenumber-js';

import type { PublicFormField } from '@/lib/apiTypes';
import { PHONE_COUNTRIES } from '@/lib/validation/phone';

/* ============================================================================
   Shared value helpers for public-form fields — phone E.164 split, DD-MM date
   parsing, word counting, image reading. Pure; imported by the renderer and
   the shared form kit.
============================================================================ */

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const MONTH_OPTIONS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const;

export function splitE164(
  value: string
): { country: CountryCode; dial: string; national: string } | null {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed.startsWith('+')) return null;

  const match = PHONE_COUNTRIES.slice()
    .sort((a, b) => b.dial.length - a.dial.length)
    .find(country => trimmed.startsWith(country.dial));
  if (!match) return null;

  return {
    country: match.iso,
    dial: match.dial,
    national: trimmed.slice(match.dial.length).replace(/\D/g, ''),
  };
}

export function isPhoneLikeField(field: PublicFormField): boolean {
  const fieldType = String(field.type || '').toLowerCase();

  if (['tel', 'phone', 'mobile'].includes(fieldType)) {
    return true;
  }

  const haystack = `${field.key} ${field.label}`.toLowerCase();

  return /(phone|mobile|tel|telephone|contact[-_\s]?number)/.test(haystack);
}

export function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function resolveMaxWords(
  field: Pick<PublicFormField, 'key' | 'label' | 'validation'>
): number | undefined {
  if (typeof field.validation?.maxWords === 'number') {
    return field.validation.maxWords;
  }

  return /(testimony|prayer[-_\s]*request)/i.test(`${field.key} ${field.label}`)
    ? 400
    : undefined;
}

export function daysInMonth(month: number): number {
  if (month === 2) return 29;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

export function parseDDMM(
  value: string
): { day: string; month: string } | null {
  if (!value || typeof value !== 'string') return null;

  const match = /^(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(month)) return null;

  return { day: match[1], month: match[2] };
}

export function parseDDMMPartial(
  value: string
): { day: string; month: string } | null {
  if (!value || typeof value !== 'string') return null;

  const match = /^(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  return { day: match[1], month: match[2] };
}

export function toDDMM(day: string, month: string): string {
  if (!day && !month) return '';
  if (!day) return `00-${month}`;
  if (!month) return `${day}-00`;
  return `${day}-${month}`;
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export function applyTemplateVars(
  input: string | undefined,
  formTitle: string
): string {
  if (!input) return '';

  return input.replace(/\{\{\s*formTitle\s*\}\}/gi, formTitle);
}

export function getFieldInputType(field: PublicFormField): string {
  const type = String(field.type || '').toLowerCase();

  if (type === 'email') return 'email';
  if (type === 'number') return 'number';
  if (type === 'url') return 'url';

  return 'text';
}
