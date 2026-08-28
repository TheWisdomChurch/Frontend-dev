'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { IMAGE_QUALITY } from '@/shared/constants';
import { Container, SectionHeader, Section } from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import { staggerViewport } from '@/shared/ui/motion';

const slides = [
  {
    src: '/Picflow/conv_1.webp',
    alt: 'A guest sharing her story during a Wisdom Church conversation',
    position: 'object-center',
  },
  {
    src: '/Picflow/Conv_2.webp',
    alt: 'Two women in conversation at Wisdom Church',
    position: 'object-center',
  },
  {
    src: '/Picflow/Conv_3.webp',
    alt: 'A guest speaking during a live church conversation',
    position: 'object-center',
  },
  {
    src: '/Picflow/Conv_4.webp',
    alt: 'A panel conversation at Wisdom Church',
    position: 'object-center',
  },
] as const;

export default function Conversations() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  const move = useCallback((direction: number) => {
    setActive(current => (current + direction + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => move(1), 5200);
    return () => window.clearInterval(timer);
  }, [move, reduceMotion]);

  return (
    <Section tone="canvas" className="overflow-hidden">
      <Container>
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 xl:gap-20">
          <SectionHeader
            eyebrow="Conversations"
            title="Real people. Real faith."
            accent="Real stories."
            description="Honest conversations about life, faith and becoming — shared by people walking the journey together."
            className="max-w-lg"
          />

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={staggerViewport}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-4xl"
          >
            {/* Shadow-card decoration is scoped to its own wrapper (sized
                to just the image) so it can't stretch to cover the nav
                buttons below it on large screens. */}
            <div className="relative lg:pb-7 lg:pr-7">
              <div className="absolute inset-x-8 bottom-0 top-8 hidden translate-x-7 border border-[var(--app-ink)]/8 bg-[var(--app-surface)] lg:block" />
              <div className="absolute inset-x-4 bottom-4 top-4 hidden translate-x-4 border border-[var(--app-ink)]/10 bg-[var(--app-canvas-2)] lg:block" />

              <div className="relative h-[300px] overflow-hidden bg-[var(--app-dark-3)] sm:h-[390px] lg:h-[450px]">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={slides[active].src}
                    initial={
                      reduceMotion ? false : { opacity: 0, x: 28, scale: 0.985 }
                    }
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, x: -20, scale: 0.99 }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slides[active].src}
                      alt={slides[active].alt}
                      fill
                      quality={IMAGE_QUALITY}
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      className={`object-cover ${slides[active].position}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 z-10 h-1 w-full bg-white/15">
                  <motion.span
                    className="block h-full origin-left bg-[var(--app-primary)]"
                    animate={{ scaleX: (active + 1) / slides.length }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 sm:mt-6">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous conversation image"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-ink)]/18 text-[var(--app-ink)] transition duration-200 hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next conversation image"
                className={buttonClass('primary', 'icon', '!rounded-full')}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
