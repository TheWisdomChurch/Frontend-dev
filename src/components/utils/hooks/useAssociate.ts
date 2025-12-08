import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useAssociatePastors = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const sectionHeadersRef = useRef<HTMLHeadingElement[]>([]);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const handleSeeMore = () => {
    router.push('/leadership');
  };

  // Add section header to ref array
  const addSectionHeaderRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && !sectionHeadersRef.current.includes(el)) {
      sectionHeadersRef.current.push(el);
    }
  }, []);

  // Add card to ref array
  const addToRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clean, professional animations for all devices
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          markers: false,
        },
      });

      // Main heading - subtle fade up
      masterTL.fromTo(
        headingRef.current,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }
      );

      // Description - delayed fade up
      masterTL.fromTo(
        descriptionRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4'
      );

      // Section headers - clean staggered entrance
      sectionHeadersRef.current.forEach((header, index) => {
        masterTL.fromTo(
          header,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          `+=${index * 0.1}`
        );
      });

      // Cards - clean staggered fade up with minimal movement
      masterTL.fromTo(
        cardsRef.current,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: {
            amount: 0.4,
            from: 'start',
          },
          ease: 'power2.out',
        },
        '-=0.2'
      );

      // Professional hover effects for desktop only
      if (window.innerWidth >= 768) {
        cardsRef.current.forEach(card => {
          const image = card.querySelector('img');
          const badge = card.querySelector('[class*="absolute"]');

          // Clean hover animation
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -8,
              scale: 1.02,
              duration: 0.3,
              ease: 'power2.out',
            });

            if (image) {
              gsap.to(image, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out',
              });
            }

            if (badge) {
              gsap.to(badge, {
                y: -2,
                duration: 0.2,
                ease: 'power2.out',
              });
            }
          });

          // Clean mouse leave animation
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
            });

            if (image) {
              gsap.to(image, {
                scale: 1,
                duration: 0.4,
                ease: 'power2.out',
              });
            }

            if (badge) {
              gsap.to(badge, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
              });
            }
          });
        });
      }

      // Remove the parallax effect as it can cause dragging feeling
      // Add smooth scroll trigger cleanup
      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return {
    sectionRef,
    contentRef,
    headingRef,
    descriptionRef,
    sectionHeadersRef,
    cardsRef,
    handleSeeMore,
    addToRefs,
    addSectionHeaderRef,
  };
};
