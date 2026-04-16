'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MathUtils } from 'three';

gsap.registerPlugin(ScrollTrigger);

const EXPLICIT_REVEAL_SELECTOR =
  '[data-gsap="reveal"], [data-scroll-fade], [data-reveal]';

const isEligibleTarget = (node: Element): node is HTMLElement => {
  if (!(node instanceof HTMLElement)) return false;
  if (node.dataset.scrollIgnore === 'true') return false;
  if (node.closest('[data-scroll-ignore="true"]')) return false;

  const style = window.getComputedStyle(node);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  if (node.offsetHeight < 24) return false;
  return true;
};

const collectRevealTargets = (root: HTMLElement): HTMLElement[] => {
  const unique = new Set<HTMLElement>();

  root.querySelectorAll(EXPLICIT_REVEAL_SELECTOR).forEach(node => {
    if (isEligibleTarget(node)) unique.add(node);
  });

  const sections = root.querySelectorAll<HTMLElement>(
    'section, article, [data-scroll-block]'
  );

  sections.forEach(section => {
    const directChildren = Array.from(section.children).filter(
      isEligibleTarget
    );
    if (directChildren.length > 0) {
      directChildren.forEach(child => unique.add(child));
      return;
    }

    if (isEligibleTarget(section)) unique.add(section);
  });

  return Array.from(unique);
};

export default function GlobalScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let refreshId = 0;
    let runTimer = 0;
    let cancelled = false;

    const runEffects = () => {
      if (cancelled) return;

      const root = document.querySelector(
        'main.page-shell'
      ) as HTMLElement | null;
      if (!root) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const isTablet = window.matchMedia(
        '(min-width: 768px) and (max-width: 1024px)'
      ).matches;
      const revealDistance = isMobile ? 16 : isTablet ? 22 : 28;
      const revealDuration = isMobile ? 0.58 : 0.85;
      const revealStagger = isMobile ? 0.045 : 0.08;
      const parallaxScale = isMobile ? 0.35 : isTablet ? 0.62 : 1;

      ctx = gsap.context(() => {
        const revealTargets = collectRevealTargets(root);
        const parallaxTargets = Array.from(
          root.querySelectorAll<HTMLElement>('[data-parallax-global]')
        ).filter(isEligibleTarget);

        if (!reduceMotion && revealTargets.length > 0) {
          gsap.set(revealTargets, {
            autoAlpha: 0,
            y: revealDistance,
            willChange: 'transform, opacity',
          });

          ScrollTrigger.batch(revealTargets, {
            start: 'top 88%',
            once: true,
            onEnter: batch => {
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: revealDuration,
                ease: 'power3.out',
                stagger: revealStagger,
                overwrite: 'auto',
                clearProps: 'transform,opacity,visibility,will-change',
              });
            },
          });
        } else {
          gsap.set(revealTargets, { clearProps: 'all' });
        }

        if (!reduceMotion && parallaxTargets.length > 0) {
          parallaxTargets.forEach(node => {
            const rawDepth = Number(node.dataset.parallaxGlobal ?? 0.14);
            const depth = MathUtils.clamp(rawDepth * parallaxScale, 0.02, 0.32);

            gsap.to(node, {
              yPercent: depth * 30,
              ease: 'none',
              scrollTrigger: {
                trigger: node,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.1,
              },
            });
          });
        }
      }, root);

      refreshId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    const scheduleRun = () => {
      // Defer until after load to avoid mutating DOM while lazy chunks hydrate.
      runTimer = window.setTimeout(runEffects, 80);
    };

    if (document.readyState === 'complete') {
      scheduleRun();
    } else {
      window.addEventListener('load', scheduleRun, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', scheduleRun);
      if (runTimer) window.clearTimeout(runTimer);
      if (refreshId) cancelAnimationFrame(refreshId);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
