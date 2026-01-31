// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import {
  bricolageGrotesque,
  worksans,
  playfair,
} from '@/components/fonts/fonts';
import { ThemeProvider } from '@/components/contexts/ThemeContext';
import { HeaderProvider } from '@/components/providers/NavProviders';
import ReduxProvider from '@/components/providers/ReduxProvider';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import ClientHeader from '@/components/layout/ClientHeader';
import ClientFooter from '@/components/layout/ClientFooter';
import ClientScrollToTop from '@/components/layout/ClientscrollTop';
import ScrollHandler from '@/components/layout/ClientScrollHandler';
import './globals.css';
import RouteLoaderProvider from '@/components/providers/RouteProvider';

// FULL PROFESSIONAL SEO — 2025 BEST PRACTICES
export const metadata: Metadata = {
  // Core
  metadataBase: new URL('https://wisdomchurchhq.org/'), 
  alternates: {
    canonical: '/',
  },

  // Title & Description
  title: {
    default: 'The Wisdom  Church | Experience God’s Transforming Power',
    template: '%s | The Wisdom Church',
  },
  description:
    'A vibrant Spirit-filled church where lives are transformed through powerful worship, biblical teaching, and authentic community. Join us this Sunday!',

  // Keywords (Google still reads them in 2025)
  keywords: [
    'wisdom house church',
    'the wisdom house church',
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

  // Author & Publisher
  authors: [
    {
      name: 'The Wisdom House Church',
      url: 'https://www.thewisdomhousechurch.org',
    },
  ],
  creator: 'The Wisdom Church',
  publisher: 'The Wisdom House Church',

  // Open Graph — Facebook, LinkedIn, WhatsApp, iMessage
  openGraph: {
    title: 'The Wisdom House Church',
    description:
      'Experience God’s transforming power in a loving, vibrant community.',
    url: 'https://www.thewisdomhousechurch.org',
    siteName: 'The Wisdom House Church',
    images: [
      {
        url: '/og-image.jpg', // Put a 1200×630 image in /public/public/og-image.jpg
        width: 1200,
        height: 630,
        alt: 'The Wisdom House Church - Welcome Home',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter / X Card
  twitter: {
    card: 'summary_large_image',
    title: 'The Wisdom House Church',
    description: 'Join us for powerful worship and life-changing messages.',
    images: ['/twitter-image.jpg'], // Optional: same as OG or 1200×600
    creator: '@wisdomhousehq', // Update to your handle if different
    site: '@wisdomhousehq',
  },

  // Robots
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

  // Verification (add your codes later)
  verification: {
    google: 'your-google-site-verification-code',
    // yandex: '',
    // bing: '',
  },
};

// Mobile responsiveness
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
        <HeaderProvider>
          <ErrorBoundary>
            <ScrollHandler />
            <RouteLoaderProvider>
              <ClientHeader />
              <main className="flex-1 flex flex-col min-h-screen">
                {children}
              </main>
              <ClientFooter />
              <ClientScrollToTop />
            </RouteLoaderProvider>
          </ErrorBoundary>
        </HeaderProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${worksans.variable} ${playfair.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className={bricolageGrotesque.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'The Wisdom House Church',
              url: 'https://www.thewisdomhousechurch.org',
              logo: 'https://www.thewisdomhousechurch.org/og-image.jpg',
              sameAs: [
                'https://www.youtube.com/@wisdomhousehq',
                'https://www.facebook.com/wisdomhousehq',
                'https://www.instagram.com/wisdomhousehq',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: ['English'],
              },
            }),
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
