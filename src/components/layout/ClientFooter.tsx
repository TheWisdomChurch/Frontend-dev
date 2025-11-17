// components/layout/ClientFooter.tsx
'use client';

import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/layout/footer'), {
  ssr: false,
  loading: () => <footer className="w-full bg-gray-50 dark:bg-gray-800 h-20" />,
});

export default function ClientFooter() {
  return <Footer />;
}
