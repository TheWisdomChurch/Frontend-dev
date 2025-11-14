// components/utils/ScrollToTop.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { colorScheme } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
      style={{
        backgroundColor: colorScheme.primary,
        color: colorScheme.black,
      }}
      aria-label="Scroll to top"
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = colorScheme.primaryDark;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = colorScheme.primary;
      }}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;
