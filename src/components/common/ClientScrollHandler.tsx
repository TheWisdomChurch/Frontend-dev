'use client';

import { useEffect } from 'react';

export default function ClientScrollHandler() {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 8;
      document.body.dataset.scrolled = scrolled ? 'true' : 'false';
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}
