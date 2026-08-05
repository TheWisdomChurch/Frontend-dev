// Single source of truth for service times/venue — this exact information
// was previously hardcoded independently across 10+ files (Header, Footer,
// About, Contact, the events pages, EventsShowcase, HeroHighlights,
// DailyPrayerAdModal). Structured rather than one fixed string, since each
// caller formats it slightly differently (a short nav chip vs. a full
// sentence vs. JSON-LD).
export const SERVICE_INFO = {
  sunday: {
    label: 'Sunday Worship',
    day: 'Sunday',
    time: '9:00 AM',
    timezone: 'WAT',
  },
  dailyPrayer: {
    label: 'Daily Prayer',
    days: 'Monday – Friday',
    daysShort: 'Mon–Fri',
    time: '7:00 AM',
    timezone: 'WAT',
  },
  venue: {
    name: 'Honor Gardens',
    area: 'Lekki-Epe',
    short: 'Honor Gardens, Lekki-Epe',
    full: 'Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe Expressway, Lagos, Nigeria',
    streetAddress: 'Opposite Dominion City, Alasia, Lekki-Epe Expressway',
    locality: 'Lagos',
    country: 'NG',
    // A Maps place ID is the most precise destination identifier. Configure it
    // in production after verifying the church's Google Business Profile. The
    // full postal address remains a safe fallback and avoids guessing at GPS
    // coordinates in application code.
    googlePlaceId: process.env.NEXT_PUBLIC_CHURCH_GOOGLE_PLACE_ID || undefined,
  },
} as const;
