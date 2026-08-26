'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Keeps an initial hash target aligned while streamed content settles. */
export default function HashScrollSync() {
  const pathname = usePathname();

  useEffect(() => {
    const rawHash = window.location.hash.slice(1);
    if (!rawHash) return;

    const target = document.getElementById(decodeURIComponent(rawHash));
    if (!target) return;

    let active = true;
    const stop = () => {
      active = false;
    };
    const align = () => {
      if (active) target.scrollIntoView({ block: 'start', behavior: 'auto' });
    };

    const frame = window.requestAnimationFrame(align);
    const observer = new ResizeObserver(align);
    observer.observe(document.body);

    window.addEventListener('wheel', stop, { passive: true, once: true });
    window.addEventListener('touchstart', stop, { passive: true, once: true });
    window.addEventListener('keydown', stop, { once: true });
    window.addEventListener('pointerdown', stop, { once: true });
    const timer = window.setTimeout(stop, 1800);

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointerdown', stop);
    };
  }, [pathname]);

  return null;
}
