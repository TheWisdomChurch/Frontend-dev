// hooks/useSlideAnimation.ts
import { useCallback } from 'react';
import gsap from 'gsap';

export const useSlideAnimation = (
  isAnimating: boolean,
  currentSlide: number,
  setIsAnimating: (value: boolean) => void,
  setCurrentSlide: (value: number) => void,
  slidesRef: React.RefObject<(HTMLDivElement | null)[]>,
  animateContentExit: () => gsap.core.Timeline, // Fix: Should return Timeline
  animateContentEntrance: () => gsap.core.Timeline // Fix: Should return Timeline
) => {
  const animateSlideTransition = useCallback(
    (nextIndex: number) => {
      if (isAnimating || nextIndex === currentSlide) return;

      setIsAnimating(true);

      const currentSlideEl = slidesRef.current[currentSlide];
      const nextSlideEl = slidesRef.current[nextIndex];

      if (!currentSlideEl || !nextSlideEl) {
        setIsAnimating(false);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
        },
      });

      tl.add(animateContentExit())
        .to(
          currentSlideEl,
          {
            scale: 1.02,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        )
        .fromTo(
          nextSlideEl,
          { scale: 0.98, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        )
        .call(
          () => {
            setCurrentSlide(nextIndex);
          },
          undefined,
          0.5
        )
        .add(animateContentEntrance(), 0.6);

      return tl;
    },
    [
      currentSlide,
      isAnimating,
      slidesRef,
      setIsAnimating,
      setCurrentSlide,
      animateContentExit,
      animateContentEntrance,
    ]
  );

  return { animateSlideTransition };
};
