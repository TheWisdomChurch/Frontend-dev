'use client';

import { useEffect } from 'react';

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * MetaPixel Component
 * Injects Facebook Pixel script and initializes tracking
 * Works in conjunction with AnalyticsProvider for consent management
 *
 * Usage: Include in layout.tsx root
 */
export default function MetaPixel() {
  // If no pixel ID, component renders nothing
  if (!metaPixelId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[MetaPixel] Missing NEXT_PUBLIC_META_PIXEL_ID in environment'
      );
    }
    return null;
  }

  useEffect(() => {
    // Initialize fbq function early (before script loads)
    if (!window.fbq) {
      window.fbq = function (...args: unknown[]) {
        if (window._fbq) {
          window._fbq.push(args);
        } else {
          window._fbq = [args];
        }
      };
      window._fbq = window._fbq || [];
    }

    // Inject Facebook Pixel script
    const loadScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.onload = () => {
        if (window.fbq) {
          // Initialize pixel (basic init - AnalyticsProvider handles detailed config)
          window.fbq('init', metaPixelId);

          // ✅ Initial PageView tracked (AnalyticsProvider tracks subsequent ones)
          window.fbq('track', 'PageView');

          if (process.env.NODE_ENV === 'development') {
            console.log('[MetaPixel] Initialized:', metaPixelId);
          }
        }
      };
      script.onerror = () => {
        console.warn('[MetaPixel] Failed to load Facebook Pixel script');
      };
      document.head.appendChild(script);
    };

    loadScript();
  }, []);

  return (
    <>
      {/* Noscript fallback for browsers with JavaScript disabled */}
      <noscript>
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
