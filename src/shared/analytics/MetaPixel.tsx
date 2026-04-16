'use client';

import { useEffect } from 'react';

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * MetaPixel Component
 * Injects Facebook Pixel script and initializes tracking
 */
export default function MetaPixel() {
  useEffect(() => {
    if (!metaPixelId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[MetaPixel] Missing NEXT_PUBLIC_META_PIXEL_ID in environment'
        );
      }
      return;
    }

    // Use type assertions instead of global declarations
    const win = window as Window & {
      fbq?: (...args: unknown[]) => void;
      _fbq?: unknown[] | { push: (...args: unknown[]) => void };
    };

    if (!win.fbq) {
      const fbq = function (...args: unknown[]) {
        if (Array.isArray(win._fbq)) {
          win._fbq.push(args);
        }
      };

      win.fbq = fbq;
      win._fbq = win._fbq || [];
    }

    const existing = document.querySelector(
      'script[data-meta-pixel="true"]'
    ) as HTMLScriptElement | null;

    if (existing) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.dataset.metaPixel = 'true';

    script.onload = () => {
      if (win.fbq) {
        win.fbq('init', metaPixelId);
        win.fbq('track', 'PageView');

        if (process.env.NODE_ENV === 'development') {
          console.log('[MetaPixel] Initialized:', metaPixelId);
        }
      }
    };

    script.onerror = () => {
      console.warn('[MetaPixel] Failed to load Facebook Pixel script');
    };

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  if (!metaPixelId) return null;

  return (
    <noscript>
      <img
        alt=""
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
