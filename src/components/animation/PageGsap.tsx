'use client';

import { useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PageGsap({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const container = containerRef.current;
    const sections = Array.from(container.children) as HTMLElement[];

    if (prefersReduced) {
      gsap.set([container, sections], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true,
      });

      gsap.fromTo(
        container,
        { opacity: 0, y: 12, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
      );

      sections.forEach((section, index) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            delay: Math.min(index * 0.05, 0.2),
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      const reveals = gsap.utils.toArray<HTMLElement>('[data-gsap="reveal"]');
      if (reveals.length) {
        ScrollTrigger.batch(reveals, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05 }
            );
          },
        });
      }

      const parallaxEls = gsap.utils
        .toArray<HTMLElement>('[data-parallax-global]')
        .slice(0, isMobile ? 6 : 16);
      if (!isMobile) {
        parallaxEls.forEach((el) => {
          const speed = Math.min(0.25, Math.max(0.08, Number(el.dataset.parallaxGlobal ?? 0.15)));
          gsap.to(el, {
            yPercent: speed * 16,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          });
        });
      }
    }, container);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  return (
    <div ref={containerRef} className="page-gsap">
      {children}
    </div>
  );
}
