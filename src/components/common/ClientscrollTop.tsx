'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, ChevronUp } from 'lucide-react';

export default function ClientScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <Link
        href="/events"
        aria-label="Notifications"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-slate-950/90 text-white shadow-lg transition hover:border-white/40"
      >
        <Bell className="h-4 w-4" />
      </Link>
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-slate-950/90 text-white shadow-lg transition hover:border-white/40 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
}
