'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ClientScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const scrollable = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      setVisible(window.scrollY > 500);
      setProgress(Math.min(window.scrollY / scrollable, 1));
      frame.current = null;
    };
    const onScroll = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={`fixed bottom-[max(var(--page-gutter),env(safe-area-inset-bottom))] right-[var(--page-gutter)] z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/90 text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:border-[var(--app-primary)] hover:text-[var(--app-primary)] active:scale-[0.95] ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <svg
        viewBox="0 0 48 48"
        className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
          className="text-[var(--app-primary)] transition-[stroke-dashoffset] duration-100"
        />
      </svg>
      <ChevronUp className="relative h-5 w-5" strokeWidth={2.25} />
    </button>
  );
}
