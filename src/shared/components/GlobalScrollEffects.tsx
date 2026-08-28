'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (
  typeof window !== 'undefined' &&
  typeof gsap.registerPlugin === 'function'
) {
  gsap.registerPlugin(ScrollTrigger);
}

const EXPLICIT_REVEAL_SELECTOR =
  '[data-gsap="reveal"], [data-scroll-fade], [data-reveal]';
const MOTION_GROUP_SELECTOR = '[data-motion-group]';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

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

  // Pure opt-in: only elements explicitly tagged with one of the reveal
  // data-attributes get a GSAP reveal. A blanket fallback that swept up
  // every <section>/<article> site-wide used to live here too — it caused
  // a tagged section and its own direct child to both get queued into the
  // same batch (double-animating one nested element), and it fired on
  // pages that never opted into this system at all (they already have
  // their own Framer Motion `whileInView` reveals).
  root.querySelectorAll(EXPLICIT_REVEAL_SELECTOR).forEach(node => {
    if (isEligibleTarget(node)) unique.add(node);
  });

  root.querySelectorAll(MOTION_GROUP_SELECTOR).forEach(group => {
    Array.from(group.children).forEach(node => {
      if (isEligibleTarget(node) && !node.hasAttribute('data-scroll-ignore')) {
        unique.add(node);
      }
    });
  });

  return Array.from(unique);
};

export default function GlobalScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ctx: gsap.Context | null = null;
    let refreshId: number | null = null;
    let runTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const runEffects = () => {
      if (cancelled) return;

      const root = document.querySelector<HTMLElement>('.page-shell');
      if (!root) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const isTablet = window.matchMedia(
        '(min-width: 768px) and (max-width: 1024px)'
      ).matches;

      const revealDistance = isMobile ? 28 : isTablet ? 40 : 56;
      const revealDuration = isMobile ? 0.66 : isTablet ? 0.82 : 0.95;
      const revealStagger = isMobile ? 0.06 : isTablet ? 0.08 : 0.11;
      const parallaxScale = isTablet ? 0.6 : 1.35;

      ctx = gsap.context(() => {
        const hero = root.querySelector<HTMLElement>('[data-site-hero]');
        const revealTargets = collectRevealTargets(root);
        const parallaxTargets = Array.from(
          root.querySelectorAll<HTMLElement>('[data-parallax-global]')
        ).filter(isEligibleTarget);

        if (!reduceMotion && hero) {
          const media = hero.querySelector<HTMLElement>('[data-hero-media]');
          const overlay = hero.querySelector<HTMLElement>(
            '[data-hero-overlay]'
          );
          const titleLines = hero.querySelectorAll<HTMLElement>(
            '[data-hero-title-line]'
          );
          const items = hero.querySelectorAll<HTMLElement>('[data-hero-item]');

          const heroTimeline = gsap.timeline({
            defaults: { ease: 'power3.out' },
          });

          if (media) {
            heroTimeline.fromTo(
              media,
              { scale: isMobile ? 1.06 : 1.12 },
              { scale: 1, duration: isMobile ? 1.4 : 1.9, ease: 'power2.out' },
              0
            );
          }
          if (overlay) {
            heroTimeline.fromTo(
              overlay,
              { opacity: 0.25 },
              { opacity: 1, duration: 1.3 },
              0
            );
          }
          heroTimeline.fromTo(
            titleLines,
            { yPercent: 118, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: isMobile ? 0.9 : 1.15,
              stagger: 0.12,
              ease: 'expo.out',
            },
            0.2
          );
          heroTimeline.fromTo(
            items,
            { y: isMobile ? 22 : 34, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.1,
              ease: 'expo.out',
            },
            0.42
          );
        }

        if (!reduceMotion && revealTargets.length > 0) {
          gsap.set(revealTargets, {
            autoAlpha: 0,
            y: revealDistance,
            scale: 0.965,
            willChange: 'transform, opacity',
          });

          ScrollTrigger.batch(revealTargets, {
            start: isMobile ? 'top 92%' : 'top 86%',
            once: true,
            onEnter: (batch: Element[]) => {
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: revealDuration,
                ease: 'expo.out',
                stagger: revealStagger,
                overwrite: 'auto',
                clearProps: 'transform,opacity,visibility,will-change',
              });
            },
          });
        } else {
          gsap.set(revealTargets, { clearProps: 'all' });
        }

        // Scrubbed transforms are intentionally desktop-only. On touch
        // devices they compete with scrolling and can make the page feel as
        // though it is moving behind the user's finger.
        if (!reduceMotion && !isMobile && parallaxTargets.length > 0) {
          parallaxTargets.forEach(node => {
            const rawDepth = Number(node.dataset.parallaxGlobal ?? 0.14);
            const depth = clamp(rawDepth * parallaxScale, 0.02, 0.42);

            gsap.to(node, {
              yPercent: depth * 58,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: node,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
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
      // Double rAF ensures we're past React's hydration commit phase
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          runTimer = setTimeout(runEffects, 120);
        });
      });
    };

    if (document.readyState === 'complete') {
      scheduleRun();
    } else {
      window.addEventListener('load', scheduleRun, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', scheduleRun);

      if (runTimer) clearTimeout(runTimer);
      if (refreshId) cancelAnimationFrame(refreshId);

      ctx?.revert();
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) =>
        trigger.kill()
      );
    };
  }, [pathname]);

  return null;
}
