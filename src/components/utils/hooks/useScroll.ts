// hooks/useScrollToTopOnPageChange.ts
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useScrollToTopOnPageChange = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
};
