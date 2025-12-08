import { useEffect } from 'react';

export const useAutoSlide = (
  isMultiSlide: boolean,
  isAnimating: boolean,
  currentSlide: number,
  slidesLength: number,
  animateSlideTransition: (index: number) => void
) => {
  useEffect(() => {
    if (!isMultiSlide) return;

    let autoSlideInterval: NodeJS.Timeout;
    let lastInteractionTime = Date.now();
    const AUTO_SLIDE_DELAY = 10000;
    const INTERACTION_TIMEOUT = 3000;

    const resetTimer = () => {
      lastInteractionTime = Date.now();
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        if (
          !isAnimating &&
          Date.now() - lastInteractionTime > INTERACTION_TIMEOUT
        ) {
          const nextSlide = (currentSlide + 1) % slidesLength;
          animateSlideTransition(nextSlide);
        }
      }, AUTO_SLIDE_DELAY);
    };

    startAutoSlide();

    const handleInteraction = () => resetTimer();
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      clearInterval(autoSlideInterval);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [
    isMultiSlide,
    isAnimating,
    currentSlide,
    slidesLength,
    animateSlideTransition,
  ]);
};
