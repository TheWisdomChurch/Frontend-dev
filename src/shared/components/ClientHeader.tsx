'use client';

import { usePathname } from 'next/navigation';
import Header from '@/shared/components/Header';

export default function ClientHeader() {
  const pathname = usePathname() || '';

  if (/^\/forms\/[^/]+/.test(pathname)) {
    return null;
  }

  return <Header />;
}
