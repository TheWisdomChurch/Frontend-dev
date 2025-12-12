/* eslint-disable prefer-const */
// hooks/useHeroAnimation.ts
import { useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useHeroAnimation = (
  heroRef: React.RefObject<HTMLDivElement>, // ✅ Non-nullable
  scrollIndicatorRef: React.RefObject<HTMLDivElement>, // ✅ Non-nullable
  animateContentEntrance: () => void
) => {
  const cleanupAnimations = useCallback(() => {
    gsap.killTweensOf('.slide');
    gsap.killTweensOf('.slide-content');
    gsap.killTweensOf('.wave-char');
    gsap.killTweensOf('.scroll-indicator');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

  useEffect(() => {
    let ctx: gsap.Context;

    // No need for null check here since refs are guaranteed to exist
    ctx = gsap.context(() => {
      // Initial hero entrance
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        }
      );

      // Initial content animation
      animateContentEntrance();

      // Scroll indicator animation
      gsap.fromTo(
        scrollIndicatorRef.current,
        { y: -5, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 1.2,
          ease: 'power2.out',
        }
      );

      const bounceAnimation = gsap.to(scrollIndicatorRef.current, {
        y: 5,
        duration: 1.2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      return () => bounceAnimation.kill();
    }, heroRef);

    return () => {
      if (ctx) ctx.revert();
      cleanupAnimations();
    };
  }, [animateContentEntrance, cleanupAnimations, heroRef, scrollIndicatorRef]);

  return { cleanupAnimations };
};
