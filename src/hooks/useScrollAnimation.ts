import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationConfig {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  markers?: boolean;
  scrub?: number | boolean;
}

export function useScrollAnimation(
  selector: string,
  animation: (target: HTMLElement | HTMLElement[]) => void,
  config: ScrollAnimationConfig = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);
    if (elements.length === 0) return;

    animation(Array.from(elements) as HTMLElement[]);

    return () => {
      (ScrollTrigger.getAll() as unknown as { kill: () => void }[]).forEach(
        trigger => trigger.kill()
      );
    };
  }, [selector, animation, config]);

  return containerRef;
}

// Parallax scroll animation
export function parallaxAnimation(elements: HTMLElement[]) {
  elements.forEach((el, idx) => {
    gsap.to(el, {
      y: -30,
      scrollTrigger: {
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        markers: false,
      },
    });
  });
}

// Fade in on scroll
export function fadeInOnScroll(elements: HTMLElement[]) {
  elements.forEach((el, idx) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
        markers: false,
      },
      ease: 'power2.out',
      stagger: 0.1 * idx,
    });
  });
}

// Scale in on scroll
export function scaleInOnScroll(elements: HTMLElement[]) {
  elements.forEach((el, idx) => {
    gsap.from(el, {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
      },
      ease: 'power2.out',
      stagger: 0.1 * idx,
    });
  });
}

// Stagger reveal
export function staggerReveal(elements: HTMLElement[]) {
  gsap.from(elements, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: elements[0].parentElement,
      start: 'top 75%',
      end: 'top 50%',
      markers: false,
    },
  });
}
