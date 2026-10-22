'use client';

import { useEffect, useRef } from 'react';

export default function ClientScrollHandler() {
  const rafId = useRef<number | null>(null);
  const isScrolledRef = useRef<boolean | null>(null);

  useEffect(() => {
    const update = () => {
      const isScrolled = window.scrollY > 16;
      if (isScrolledRef.current !== isScrolled) {
        isScrolledRef.current = isScrolled;
        document.body.dataset.scrolled = isScrolled ? 'true' : 'false';
      }
      rafId.current = null;
    };

    const handleScroll = () => {
      if (rafId.current === null) {
        rafId.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return null;
}
