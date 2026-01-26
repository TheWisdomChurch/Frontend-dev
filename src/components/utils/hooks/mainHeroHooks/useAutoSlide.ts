import { useEffect, useRef } from 'react';

export const useAutoSlide = (
  isMultiSlide: boolean,
  isAnimating: boolean,
  currentSlide: number,
  slidesLength: number,
  animateSlideTransition: (index: number) => void
) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastInteractionRef = useRef<number>(Date.now());
  const animatingRef = useRef(isAnimating);
  const currentSlideRef = useRef(currentSlide);

  // Keep refs in sync without re-registering listeners
  useEffect(() => {
    animatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    if (!isMultiSlide) return;

    const AUTO_SLIDE_DELAY = 10000;
    const INTERACTION_TIMEOUT = 3000;

    const tick = () => {
      if (
        !animatingRef.current &&
        Date.now() - lastInteractionRef.current > INTERACTION_TIMEOUT
      ) {
        const next = (currentSlideRef.current + 1) % slidesLength;
        animateSlideTransition(next);
      }
    };

    const start = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, AUTO_SLIDE_DELAY);
    };

    const handleInteraction = () => {
      lastInteractionRef.current = Date.now();
    };

    start();
    window.addEventListener('pointerdown', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [isMultiSlide, slidesLength, animateSlideTransition]);
};
