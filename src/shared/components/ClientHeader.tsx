// components/layout/ClientHeader.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import Navigation to avoid SSR issues
const Navigation = dynamic(() => import('@/shared/components/Navigation'), {
  ssr: false,
  loading: () => <header className="w-full h-16 sm:h-20" />,
});

export default function ClientHeader() {
  return <Navigation />;
}
