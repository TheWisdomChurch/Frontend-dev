import { useEffect } from 'react';
import gsap from 'gsap';

export const useWaveTextAnimation = (
  waveTextRef: React.RefObject<HTMLDivElement>,
  showWaveText: boolean
) => {
  useEffect(() => {
    if (!showWaveText) return;

    const text = waveTextRef.current;
    if (!text) return;
    const chars = text.querySelectorAll('.wave-char');
    if (!chars.length) return;

    gsap.set(chars, { y: 0, opacity: 0, scale: 1 });

    const waveAnimation = gsap.timeline({
      repeat: -1,
      repeatDelay: 6,
      paused: false,
    });

    chars.forEach((char, i) => {
      waveAnimation.fromTo(
        char,
        { y: 15, opacity: 0, scale: 0.7 },
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

    waveAnimation.to(
      chars,
      {
        y: (i: number) => Math.sin(i * 0.5 + waveAnimation.time()) * 1,
        duration: 3,
        ease: 'sine.inOut',
      },
      '-=0.2'
    );

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
  }, [showWaveText, waveTextRef]);
};
