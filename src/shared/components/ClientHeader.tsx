// components/layout/ClientHeader.tsx
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/shared/components/Header';

export default function ClientHeader() {
  const pathname = usePathname() || '';

  // Public form links should render distraction-free (no global navigation header).
  if (/^\/forms\/[^/]+/.test(pathname)) {
    return null;
  }

  return <Header />;
}
