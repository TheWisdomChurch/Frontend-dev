import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

import '@/app/globals.scss';

import { dmSans } from '@/shared/fonts/fonts';
import { cn } from '@/lib/cn';
import { Providers } from './providers';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE as OG_IMAGE,
  buildHreflangAlternates,
} from '@/lib/seo';
import HeroHighlights from '@/features/hero/HeroHighlights';
import CommunityJoinModal from '@/features/community/CommunityJoinModalLoader';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    languages: buildHreflangAlternates('/'),
  },
  title: {
    default: 'The Wisdom Church | Experience God’s Transforming Power',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'A vibrant, Spirit-filled church in Lagos where lives are transformed through worship, biblical teaching, and authentic community. Join us this Sunday.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
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
        type: 'image/webp',
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
    images: [OG_IMAGE],
    creator: SOCIAL_LINKS.handle,
    site: SOCIAL_LINKS.handle,
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
  verification: {
    google: 'uOPR3Lh4dhAVkY-jD_5e6cFGtrW2NTpy4TDCtU93-sY',
  },
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
  other: {
    'msvalidate.01': 'CDC0BA45440A0A1BB38769D83C132EBB',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

// Production analytics must never initialize while developing locally. Apart
// from polluting production data, both Ahrefs and Vercel Analytics deliberately
// reject localhost events and emit noisy diagnostics. Vercel provides this
// value at build time; self-hosted production deployments can opt in explicitly.
const productionAnalyticsEnabled =
  process.env.VERCEL_ENV === 'production' ||
  process.env.ANALYTICS_ENABLED === 'true';

export default function RootLayout({ children }: { children: ReactNode }) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: SITE_NAME,
    url: SITE_URL,
    logo: OG_IMAGE,
    sameAs: [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.instagram,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: CONTACT_INFO.phone,
      email: CONTACT_INFO.email,
      availableLanguage: ['English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SERVICE_INFO.venue.name}, ${SERVICE_INFO.venue.streetAddress}`,
      addressLocality: SERVICE_INFO.venue.locality,
      addressCountry: SERVICE_INFO.venue.country,
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
      className={cn(dmSans.variable, 'antialiased')}
      suppressHydrationWarning
    >
      <body
        className={cn(
          'min-h-screen overflow-x-clip bg-[var(--app-surface)] font-body'
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {productionAnalyticsEnabled ? (
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="XGrQDDaQUVZrI428swX0CA"
            strategy="afterInteractive"
          />
        ) : null}
        <Providers>
          {children}
          <HeroHighlights modalOnly />
          <CommunityJoinModal />
        </Providers>
        {productionAnalyticsEnabled ? (
          <Analytics mode="production" debug={false} />
        ) : null}
      </body>
    </html>
  );
}
