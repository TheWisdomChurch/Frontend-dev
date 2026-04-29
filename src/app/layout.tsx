import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import '@/app/globals.scss';

import MetaPixel from '@/shared/analytics/MetaPixel';
import { bricolageGrotesque, playfair, worksans } from '@/shared/fonts/fonts';
import { cn } from '@/lib/cn';
import { Providers } from './providers';

const SITE_URL = 'https://wisdomchurchhq.org';
const SITE_NAME = 'The Wisdom Church';
const OG_IMAGE = `${SITE_URL}/og-image.webp`;

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
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'The Wisdom Church is a vibrant Spirit-filled church where lives are transformed through powerful worship, biblical teaching, and authentic community. Join us this Sunday!',
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
  themeColor: '#050505',
};

export default function RootLayout({ children }: { children: ReactNode }) {
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
        'scroll-smooth antialiased'
      )}
      suppressHydrationWarning
    >
      <body
        className={cn(
          worksans.className,
          'min-h-screen overflow-x-hidden bg-[#050505] font-sans text-white'
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
        <MetaPixel />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
