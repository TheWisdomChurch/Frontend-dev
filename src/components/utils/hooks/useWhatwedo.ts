'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useWhatWeDo = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate main heading
      gsap.fromTo(
        headingRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate boxes with staggered effect
      boxesRef.current.forEach((box, index) => {
        if (box) {
          gsap.fromTo(
            box,
            {
              y: 100,
              opacity: 0,
              rotationY: 15,
              scale: 0.9,
            },
            {
              y: 0,
              opacity: 1,
              rotationY: 0,
              scale: 1,
              duration: 1.2,
              delay: index * 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: box,
                start: 'top 75%',
                end: 'bottom 25%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Hover animation for boxes
          box.addEventListener('mouseenter', () => {
            gsap.to(box, {
              scale: 1.02,
              y: -8,
              duration: 0.6,
              ease: 'power2.out',
            });
          });

          box.addEventListener('mouseleave', () => {
            gsap.to(box, {
              scale: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
            });
          });
        }
      });

      // Animate mission statement text
      gsap.fromTo(
        textRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToBoxesRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      boxesRef.current[index] = el;
    }
  };

  return {
    sectionRef,
    boxesRef,
    headingRef,
    textRef,
    addToBoxesRef,
  };
};
