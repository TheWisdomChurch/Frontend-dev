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
    router.push('/about/leadership');
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
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Mobile-optimized animations
      if (isMobile) {
        // Simplified mobile animations
        const mobileTL = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none none',
            markers: false, // Remove in production
          },
        });

        // Basic fade in for mobile
        mobileTL.fromTo(
          [headingRef.current, descriptionRef.current],
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
          }
        );

        // Simple card animations for mobile
        mobileTL.fromTo(
          cardsRef.current,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.3'
        );

        // Section headers for mobile
        mobileTL.fromTo(
          sectionHeadersRef.current,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.2'
        );
      } else {
        // Desktop animations (your original animations)
        const masterTL = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            markers: false, // Remove in production
          },
        });

        // Section mount animation
        masterTL.fromTo(
          sectionRef.current,
          {
            opacity: 0,
            scale: 0.98,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
          }
        );

        // Main heading animation
        masterTL.fromTo(
          headingRef.current,
          {
            y: 80,
            opacity: 0,
            rotationX: 45,
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.8'
        );

        // Description animation
        masterTL.fromTo(
          descriptionRef.current,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.5'
        );

        // Section headers animation
        sectionHeadersRef.current.forEach((header, index) => {
          masterTL.fromTo(
            header,
            {
              y: 50,
              opacity: 0,
              scale: 0.9,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: 'back.out(1.4)',
            },
            `+=${index * 0.1}`
          );
        });

        // Cards animation
        masterTL.fromTo(
          cardsRef.current,
          {
            y: 100,
            opacity: 0,
            rotationY: 15,
            scale: 0.8,
          },
          {
            y: 0,
            opacity: 1,
            rotationY: 0,
            scale: 1,
            duration: 0.9,
            stagger: {
              amount: 0.6,
              from: 'center',
              grid: 'auto',
            },
            ease: 'power3.out',
          },
          '-=0.3'
        );

        // Desktop hover effects only
        if (!isMobile) {
          cardsRef.current.forEach(card => {
            const image = card.querySelector('img');
            const badge = card.querySelector('[class*="absolute"]');

            // Mouse enter animation
            card.addEventListener('mouseenter', () => {
              gsap.to(card, {
                y: -15,
                scale: 1.03,
                rotationY: 5,
                duration: 0.4,
                ease: 'power2.out',
              });

              if (image) {
                gsap.to(image, {
                  scale: 1.1,
                  duration: 0.4,
                  ease: 'power2.out',
                });
              }

              if (badge) {
                gsap.to(badge, {
                  y: -5,
                  scale: 1.1,
                  duration: 0.3,
                  ease: 'power2.out',
                });
              }
            });

            // Mouse leave animation
            card.addEventListener('mouseleave', () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out',
              });

              if (image) {
                gsap.to(image, {
                  scale: 1,
                  duration: 0.5,
                  ease: 'power2.out',
                });
              }

              if (badge) {
                gsap.to(badge, {
                  y: 0,
                  scale: 1,
                  duration: 0.4,
                  ease: 'power2.out',
                });
              }
            });
          });
        }

        // Subtle parallax effect for desktop only
        gsap.to(sectionRef.current, {
          y: 10,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
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
