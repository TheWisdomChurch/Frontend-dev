// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { bricolageGrotesque, worksans, playfair } from '@/shared/fonts/fonts';

import MetaPixel from '@/shared/analytics/MetaPixel';
import { Providers } from './providers';
import { cn } from '@/lib/cn';
import './globals.scss';

const SITE_URL = 'https://wisdomchurchhq.org';
const SITE_NAME = 'The Wisdom Church';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'en-NG': '/',
    },
  },

  title: {
    default: 'The Wisdom Church | Experience God’s Transforming Power',
    template: '%s | The Wisdom Church',
  },
  description:
    'The Wisdom Church is a vibrant Spirit-filled church where lives are transformed through powerful worship, biblical teaching, and authentic community. Join us this Sunday!',
  applicationName: SITE_NAME,

  keywords: [
    'wisdomchurch',
    'wisdom house church',
    'the wisdom house church',
    'wisdom church',
    'wisdom house',
    'pentecostal church',
    'spirit filled church',
    'church near me',
    'sunday service',
    'bible teaching church',
    'holy spirit church',
    'christian church',
    'place of worship',
    'faith community',
    'churches near me',
    'church services near me',
    'non denominational church near me',
    'contemporary church near me',
    'worship services near me',
    'sunday morning church service',
    'online church services',
    'live church service',
    'pentecostal churches near me',
    'charismatic church',
    'full gospel church',
    'spirit filled churches',
    'holy ghost church',
    'bible study',
    'youth ministry',
    'church events',
    'christian community',
    'worship music',
    'church choir',
    'childrens ministry',
    "women's ministry",
    "men's ministry",
    'church small groups',
    'volunteer at church',
    'church volunteer opportunities',
    'church live stream',
  ],

  authors: [
    {
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  openGraph: {
    title: SITE_NAME,
    description:
      'Experience God’s transforming power in a loving, vibrant community.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Welcome Home`,
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    alternateLocale: ['en_NG'],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Join us for powerful worship and life-changing messages.',
    images: [OG_IMAGE], // use same OG image
    creator: '@wisdomhousehq',
    site: '@wisdomhousehq',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'religion',

  // ✅ Verification: token ONLY (NOT .html filename)
  verification: {
    google: '06pkcDIlRljdgVWZrLV9a9tqH7FJ5xp9lMfhho7LaRU',
  },
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
  other: {
    'msvalidate.01': 'CDC0BA45440A0A1BB38769D83C132EBB',
    'theme-color': '#050505',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: SITE_NAME,
    url: SITE_URL,
    logo: OG_IMAGE,
    sameAs: [
      'https://www.facebook.com/wisdomhousehq',
      'https://www.youtube.com/@wisdomhousehq',
      'https://www.instagram.com/wisdomhousehq',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '0706 999 5333',
      email: 'wisdomhousehq@gmail.com',
      availableLanguage: ['English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        'Honor Gardens, opposite Dominion City, Alasia, Lekki-Epe Expressway',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/resources?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang="en"
      className={cn(
        bricolageGrotesque.variable,
        worksans.variable,
        playfair.variable,
        'antialiased'
      )}
      suppressHydrationWarning
    >
      <body className={cn(worksans.className, 'font-sans')}>
        {/* ✅ Valid JSON-LD only (no <meta> inside JSON.stringify) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <MetaPixel />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
