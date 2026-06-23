// components/utils/MobileDebug.tsx
/* eslint-disable no-console */
'use client';

import { useEffect } from 'react';

export default function MobileDebug() {
  useEffect(() => {
    // Log component dimensions on mobile
    const checkLayout = () => {
      if (window.innerWidth < 768) {
        // Log specific sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          console.log(`Section ${index}:`, {
            height: rect.height,
            top: rect.top,
            bottom: rect.bottom,
            className: section.className,
          });
        });
      }
    };

    // Check on load and resize
    checkLayout();
    window.addEventListener('resize', checkLayout);

    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  return null;
}
