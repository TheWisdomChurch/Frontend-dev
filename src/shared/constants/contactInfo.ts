// Single source of truth for contact details and social links — this exact
// information was previously hardcoded independently across 10+ files
// (Header, Footer, root layout's JSON-LD, Contact page, SeniorPastor,
// ConnectPortal, resources pages, Sermons, HeroMain, lib/data.ts), with
// inconsistent formatting (e.g. some used facebook.com, others
// www.facebook.com — same account, different strings).
export const CONTACT_INFO = {
  phone: '0706 999 5333',
  email: 'wisdomhousehq@gmail.com',
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/wisdomhousehq',
  instagram: 'https://www.instagram.com/wisdomhousehq',
  youtube: 'https://www.youtube.com/@wisdomhousehq',
  x: 'https://x.com/wisdomhousehq',
  whatsapp: 'https://wa.me/2347069995333',
  // Twitter/X handle used for openGraph/twitter meta tags, not a profile link.
  handle: '@wisdomhousehq',
} as const;
