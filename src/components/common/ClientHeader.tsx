// components/layout/ClientHeader.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import Header to avoid SSR issues
const Header = dynamic(() => import('@/components/layout/header'), {
  ssr: false,
  loading: () => (
    <header className="w-full bg-white dark:bg-gray-900 h-16 border-b border-gray-200 dark:border-gray-700" />
  ),
});

export default function ClientHeader() {
  return <Header />;
}
