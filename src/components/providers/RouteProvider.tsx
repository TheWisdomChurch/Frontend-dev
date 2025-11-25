'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Loader from '../ui/Loader';

export default function RouteLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Show for 950ms — long enough to admire, short enough to feel fast
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 950);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Prevent flash on first load
  useEffect(() => {
    setIsVisible(false);
  }, []);

  return (
    <>
      {/* Smooth fade in/out */}
      <div
        className={`fixed inset-0 transition-opacity duration-500 ease-out z-[9999] ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {isVisible && <Loader />}
      </div>

      {children}
    </>
  );
}
