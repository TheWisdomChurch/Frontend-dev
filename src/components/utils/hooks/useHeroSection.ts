import { useState, useEffect, useRef, useCallback } from 'react';
import { slides } from '@/lib/data';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useTheme } from '@/components/contexts/ThemeContext';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export const useHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolledOut, setHasScrolledOut] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const { colorScheme } = useTheme();

  // Fixed scroll function
  const scrollToNextSection = useCallback(() => {
    const nextSection = heroRef.current?.nextElementSibling;

    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  const handleHoverEnter = useCallback(() => {
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        y: 5,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, []);

  const handleHoverLeave = useCallback(() => {
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect when hero section enters/exits view and trigger slide changes
  useEffect(() => {
    if (!heroRef.current) return;

    let hasTriggeredThisEntry = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (hasScrolledOut && !hasTriggeredThisEntry) {
            hasTriggeredThisEntry = true;
            nextSlide();
          }
          setHasScrolledOut(false);
        } else {
          setHasScrolledOut(true);
          hasTriggeredThisEntry = false;
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-100px 0px 0px 0px',
      }
    );

    observer.observe(heroRef.current);

    return () => {
      observer.disconnect();
    };
  }, [currentSlide, hasScrolledOut]);

  // Initial animations on component mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
        }
      );

      animateContentEntrance();

      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { y: -10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 2,
            ease: 'power2.out',
          }
        );

        const bounceAnimation = gsap.to(scrollIndicatorRef.current, {
          y: 15,
          duration: 1.5,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
        });

        return () => bounceAnimation.kill();
      }
    });

    return () => ctx.revert();
  }, []);

  const animateContentEntrance = () => {
    const tl = gsap.timeline();

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }

    const dividerLine = document.querySelector('.divider-line');
    if (dividerLine) {
      tl.fromTo(
        dividerLine,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (buttonsRef.current && buttonsRef.current.children) {
      tl.fromTo(
        buttonsRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
        },
        '-=0.2'
      );
    }

    return tl;
  };

  const animateContentExit = () => {
    const tl = gsap.timeline();

    const targets = [];
    if (titleRef.current) targets.push(titleRef.current);
    if (subtitleRef.current) targets.push(subtitleRef.current);
    if (descriptionRef.current) targets.push(descriptionRef.current);
    if (buttonsRef.current && buttonsRef.current.children) {
      targets.push(...Array.from(buttonsRef.current.children));
    }

    if (targets.length > 0) {
      tl.to(targets, {
        y: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.in',
      });
    }

    return tl;
  };

  const animateSlideTransition = async (nextIndex: number) => {
    const currentSlideEl = slidesRef.current[currentSlide];
    const nextSlideEl = slidesRef.current[nextIndex];

    if (!currentSlideEl || !nextSlideEl) return;

    const tl = gsap.timeline();

    tl.add(animateContentExit())
      .to(
        currentSlideEl,
        {
          scale: 1.1,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        0
      )
      .fromTo(
        nextSlideEl,
        { scale: 1.1, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        0
      )
      .call(
        () => {
          setCurrentSlide(nextIndex);
        },
        undefined,
        0.6
      )
      .add(animateContentEntrance(), 0.8);

    return tl;
  };

  const nextSlide = async () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    await animateSlideTransition(nextIndex);
  };

  const goToSlide = async (index: number) => {
    if (index === currentSlide) return;

    const clickedIndicator = indicatorsRef.current[index];
    if (clickedIndicator) {
      gsap.fromTo(
        clickedIndicator,
        { scale: 1 },
        {
          scale: 1.3,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        }
      );
    }

    await animateSlideTransition(index);
  };

  const addToSlidesRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      slidesRef.current[index] = el;
    }
  };

  const addToIndicatorsRef = (el: HTMLButtonElement | null, index: number) => {
    if (el) {
      indicatorsRef.current[index] = el;
    }
  };

  return {
    currentSlide,
    isScrolled,
    heroRef,
    slidesRef,
    contentRef,
    titleRef,
    subtitleRef,
    descriptionRef,
    buttonsRef,
    indicatorsRef,
    scrollIndicatorRef,
    colorScheme,
    scrollToNextSection,
    handleHoverEnter,
    handleHoverLeave,
    goToSlide,
    addToSlidesRef,
    addToIndicatorsRef,
  };
};
