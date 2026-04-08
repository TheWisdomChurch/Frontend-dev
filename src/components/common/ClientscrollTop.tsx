// components/utils/ClientScrollToTop.tsx
'use client';

import dynamic from 'next/dynamic';

const ScrollToTop = dynamic(() => import('@/components/utils/ScrollToTop'), {
  ssr: false,
});

export default function ClientScrollToTop() {
  return <ScrollToTop />;
}
