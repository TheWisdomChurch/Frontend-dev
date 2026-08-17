'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageTipCard from '@/shared/ui/PageTipCard';

const SHOW_DELAY_MS = 2500;
const STORAGE_PREFIX = 'wisdom_tip_seen:';

const PAGE_TIPS: Record<string, string> = {
  '/about': 'A quick look at who we are, our story, and our leadership.',
  '/leadership': 'Meet the people leading The Wisdom Church.',
  '/ministries': 'Find a community for your season of life and faith.',
  '/events': 'Everything coming up — services, programs, and special events.',
  '/resources': 'Sermons, articles, and ways to grow between Sundays.',
  '/resources/sermons': 'Watch recent messages or browse teaching by series.',
  '/pastoral': 'Reach our pastoral team directly for prayer or care.',
  '/serve': 'Explore each team and choose where your gifts can make an impact.',
  '/giving': 'Choose a verified giving option or contact the giving team.',
  '/contact': 'The fastest ways to reach us, and where to find us.',
  '/testimonies': 'Real stories from people in our community.',
};

function hasSeenTip(key: string): boolean {
  try {
    return !!localStorage.getItem(STORAGE_PREFIX + key);
  } catch {
    return false;
  }
}

function markTipSeen(key: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, '1');
  } catch {
    // storage unavailable — the tip may reappear next visit, an acceptable
    // degradation rather than a crash.
  }
}

export default function PageTipHost() {
  const pathname = usePathname();
  const message = pathname ? PAGE_TIPS[pathname] : undefined;
  const [visible, setVisible] = useState(false);

  // Reset visibility when the route changes (adjusting state during render,
  // per React's guidance, rather than in an effect).
  const [trackedPathname, setTrackedPathname] = useState(pathname);
  if (pathname !== trackedPathname) {
    setTrackedPathname(pathname);
    setVisible(false);
  }

  useEffect(() => {
    if (!message || !pathname || hasSeenTip(pathname)) return;

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname, message]);

  if (!message || !pathname) return null;

  const dismiss = () => {
    markTipSeen(pathname);
    setVisible(false);
  };

  return <PageTipCard message={message} open={visible} onDismiss={dismiss} />;
}
