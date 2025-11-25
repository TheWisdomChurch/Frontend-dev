'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Loader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const dots = dotsRef.current;

    // Enter with fade + slight scale
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    // Ultra-smooth, elegant bounce — slower, more visible
    gsap.to(dots, {
      y: -22,
      duration: 0.9,
      ease: 'power3.inOut',
      stagger: {
        each: 0.16,
        from: 'center',
        yoyo: true,
        repeat: -1,
      },
    });

    // Optional: Add subtle pulsing scale for extra life
    gsap.to(dots, {
      scale: 1.3,
      duration: 0.9,
      ease: 'power3.inOut',
      stagger: {
        each: 0.16,
        from: 'center',
        yoyo: true,
        repeat: -1,
      },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Deeper dark
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            ref={el => {
              dotsRef.current[i] = el;
            }}
            className="w-1.5 h-1.5 rounded-full" // Tiny & sleek (6px)
            style={{
              backgroundColor: '#F7DE12',
              boxShadow: `
                0 0 20px #F7DE12,
                0 0 40px #F7DE12,
                0 0 60px rgba(247, 222, 18, 0.8),
                0 0 80px rgba(247, 222, 18, 0.6)
              `,
              filter: 'brightness(1.4)', // Makes gold POP
            }}
          />
        ))}
      </div>
    </div>
  );
}
