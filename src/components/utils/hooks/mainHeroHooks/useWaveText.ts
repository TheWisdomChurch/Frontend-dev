/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useWaveTextAnimation.ts
import { useEffect } from 'react';
import gsap from 'gsap';

export const useWaveTextAnimation = (
  waveTextRef: React.RefObject<HTMLDivElement>, // ✅ Non-nullable
  showWaveText: boolean,
  colorScheme: any
) => {
  useEffect(() => {
    if (!showWaveText) return;

    const text = waveTextRef.current;
    const chars = text.querySelectorAll('.wave-char');

    // Reset all characters
    gsap.set(chars, {
      y: 0,
      opacity: 0,
      scale: 1,
    });

    // Create a clean wave animation
    const waveAnimation = gsap.timeline({
      repeat: -1,
      repeatDelay: 6,
      paused: false,
    });

    // Simple wave effect with better visibility
    chars.forEach((char, i) => {
      waveAnimation.fromTo(
        char,
        {
          y: 15,
          opacity: 0,
          scale: 0.7,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.3)',
          delay: i * 0.04,
        },
        i * 0.04
      );
    });

    // Subtle continuous effect
    waveAnimation.to(
      chars,
      {
        y: i => Math.sin(i * 0.5 + waveAnimation.time()) * 1,
        duration: 3,
        ease: 'sine.inOut',
      },
      '-=0.2'
    );

    // Fade out
    waveAnimation.to(chars, {
      y: -10,
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in',
      stagger: 0.015,
      delay: 2,
    });

    return () => {
      waveAnimation.kill();
    };
  }, [showWaveText, waveTextRef, colorScheme]);
};
