import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

import '@/app/globals.scss';

import { dmSans } from '@/shared/fonts/fonts';
import { cn } from '@/lib/cn';
import { Providers } from './providers';
import { SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import {
  SITE_URL,
  SITE_NAME,
  SITE_ALT_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  DEFAULT_OG_IMAGE as OG_IMAGE,
  buildHreflangAlternates,
  buildOrganizationSchema,
  buildWebSiteSchema,
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
    default: `${SITE_NAME} (${SITE_ALT_NAME}) | Experience God’s Transforming Power in Lagos`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  manifest: '/manifest.webmanifest',
  formatDetection: { telephone: true, email: true, address: true },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 638,
        height: 630,
        alt: `${SITE_NAME} (${SITE_ALT_NAME}) logo`,
        type: 'image/webp',
      },
    ],
    locale: 'en_US',
    alternateLocale: ['en_NG'],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/OIP.webp', type: 'image/webp' },
    ],
    shortcut: '/favicon.ico',
    apple: '/OIP.webp',
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
  const orgSchema = buildOrganizationSchema();
  const websiteSchema = buildWebSiteSchema();

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
