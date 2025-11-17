import { useEffect, useRef } from 'react';
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
  const addSectionHeaderRef = (el: HTMLHeadingElement | null) => {
    if (el && !sectionHeadersRef.current.includes(el)) {
      sectionHeadersRef.current.push(el);
    }
  };

  // Add card to ref array
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Master timeline for sequenced animations
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      // Section mount animation - fade in with scale
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

      // Animate main heading with text reveal effect
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
        '-=0.8' // Overlap with previous animation
      );

      // Animate description text
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

      // Animate section headers
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
          `+=${index * 0.1}` // Stagger the section headers
        );
      });

      // Animate cards with professional stagger effect
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

      // Enhanced hover animations for cards with 3D effects
      cardsRef.current.forEach(card => {
        const image = card.querySelector('img');
        const badge = card.querySelector('[class*="absolute"]'); // The role badge
        const name = card.querySelector('h3');
        const description = card.querySelector('p');

        // Mouse enter animation
        card.addEventListener('mouseenter', () => {
          const hoverTL = gsap.timeline();

          hoverTL
            .to(card, {
              y: -15,
              scale: 1.03,
              rotationY: 5,
              duration: 0.4,
              ease: 'power2.out',
            })
            .to(
              image,
              {
                scale: 1.1,
                duration: 0.4,
                ease: 'power2.out',
              },
              0
            )
            .to(
              badge,
              {
                y: -5,
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out',
              },
              0
            )
            .to(
              name,
              {
                color: '#8bea19', // Your lime green color
                duration: 0.2,
                ease: 'power2.out',
              },
              0
            )
            .to(
              description,
              {
                y: -2,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
              },
              0
            );
        });

        // Mouse leave animation
        card.addEventListener('mouseleave', () => {
          const leaveTL = gsap.timeline();

          leaveTL
            .to(card, {
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.5,
              ease: 'power2.out',
            })
            .to(
              image,
              {
                scale: 1,
                duration: 0.5,
                ease: 'power2.out',
              },
              0
            )
            .to(
              badge,
              {
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out',
              },
              0
            )
            .to(
              name,
              {
                color: '', // Reset to original color
                duration: 0.3,
                ease: 'power2.out',
              },
              0
            )
            .to(
              description,
              {
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
              },
              0
            );
        });
      });

      // Subtle continuous animation for the section
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
