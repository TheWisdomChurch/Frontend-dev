import type { Testimonial as ApiTestimonial } from '@/lib/apiTypes';

export interface TestimonialItem {
  id: string | number;
  name: string;
  quote: string;
  role: string;
  category: string;
  isAnonymous: boolean;
  date?: string;
  avatarColor?: string;
}

export function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  if (
    lower.includes('heal') ||
    lower.includes('doctor') ||
    lower.includes('hospital') ||
    lower.includes('surgery') ||
    lower.includes('pain') ||
    lower.includes('sick') ||
    lower.includes('disease')
  ) {
    return 'Divine Healing';
  }
  if (
    lower.includes('contract') ||
    lower.includes('job') ||
    lower.includes('business') ||
    lower.includes('promotion') ||
    lower.includes('career') ||
    lower.includes('financial') ||
    lower.includes('debt') ||
    lower.includes('money')
  ) {
    return 'Breakthrough & Career';
  }
  if (
    lower.includes('marriage') ||
    lower.includes('family') ||
    lower.includes('child') ||
    lower.includes('baby') ||
    lower.includes('husband') ||
    lower.includes('wife') ||
    lower.includes('home')
  ) {
    return 'Family & Restoration';
  }
  if (
    lower.includes('exam') ||
    lower.includes('school') ||
    lower.includes('admission') ||
    lower.includes('degree') ||
    lower.includes('university')
  ) {
    return 'Academic Favor';
  }
  return 'Supernatural Grace';
}

export function mapApiTestimonial(t: ApiTestimonial): TestimonialItem {
  const name =
    t.fullName ||
    [t.firstName, t.lastName].filter(Boolean).join(' ').trim() ||
    'Anonymous member';

  return {
    id: t.id,
    name: t.isAnonymous ? 'Anonymous member' : name,
    quote: t.testimony,
    role: t.isAnonymous ? 'Shared anonymously' : 'Wisdom Church Community',
    category: detectCategory(t.testimony),
    isAnonymous: Boolean(t.isAnonymous),
    date: t.createdAt
      ? new Date(t.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Verified Praise Report',
  };
}

export function initialsOf(fullName: string): string {
  const clean = fullName.replace(/^(Bro\.|Sis\.|Dcn\.|Pst\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase() || 'W';
}
