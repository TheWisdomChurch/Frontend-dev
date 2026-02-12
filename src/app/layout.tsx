// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import {
  bricolageGrotesque,
  worksans,
  playfair,
} from '@/components/fonts/fonts';

import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { ServiceUnavailableProvider } from '@/components/contexts/ServiceUnavailableContext';
import { HeaderProvider } from '@/components/providers/NavProviders';
import ReduxProvider from '@/components/providers/ReduxProvider';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import ClientHeader from '@/components/layout/ClientHeader';
import ClientFooter from '@/components/layout/ClientFooter';
import ClientScrollToTop from '@/components/layout/ClientscrollTop';
import ScrollHandler from '@/components/layout/ClientScrollHandler';
import './globals.css';

const SITE_URL = 'https://wisdomchurchhq.org';
const SITE_NAME = 'The Wisdom Church';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },

  title: {
    default: 'The Wisdom Church | Experience God’s Transforming Power',
    template: '%s | The Wisdom Church',
  },
  description:
    'The Wisdom Church is a vibrant Spirit-filled church where lives are transformed through powerful worship, biblical teaching, and authentic community. Join us this Sunday!',

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

  // ✅ Verification: token ONLY (NOT .html filename)
  verification: {
  google: '06pkcDIlRljdgVWZrLV9a9tqH7FJ5xp9lMfhho7LaRU',
},
other: {
  'msvalidate.01': 'CDC0BA45440A0A1BB38769D83C132EBB',
},
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Client wrapper component — UNCHANGED
function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <ServiceUnavailableProvider>
          <HeaderProvider>
            <ErrorBoundary>
              <ScrollHandler />
              <ClientHeader />
              <main className="flex-1 flex flex-col min-h-screen page-gsap page-shell">
                {children}
              </main>
              <ClientFooter />
              <ClientScrollToTop />
            </ErrorBoundary>
          </HeaderProvider>
        </ServiceUnavailableProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

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
      email: 'Wisdomhousehq@gmail.com',
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

  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${worksans.variable} ${playfair.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className={worksans.className}>
        {/* ✅ Valid JSON-LD only (no <meta> inside JSON.stringify) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
