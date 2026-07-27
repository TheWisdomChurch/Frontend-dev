'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { whatWeDoData } from '@/lib/data';
import { Section } from '@/shared/layout';
import { IMAGE_QUALITY } from '@/shared/constants';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion/staggerReveal';

const SLIDES = whatWeDoData.slice(0, 4).map((item, i) => ({
  ...item,
  headline:
    [
      'We raise\nbelievers,\nnot just members.',
      'We gather as\na people\nof prayer.',
      'We worship\nwith our\nwhole heart.',
      'We are shaped\nby the\nliving Word.',
    ][i] ?? item.title,
}));

const AUTO_MS = 6000;

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (i: number) => setActive((i + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => goTo(active + 1), AUTO_MS);
    return () => clearInterval(t);
  }, [active, paused, goTo]);

  return (
    <Section
      id="what-we-do"
      padding="none"
      fullHeight={false}
      perf="none"
      className="bg-[var(--app-dark)]"
    >
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="contents"
      >
        <div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-2 lg:min-h-[680px]">
          {/* ── Left — content ──────────────────────────────────── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={staggerViewport}
            className="flex flex-col justify-between px-6 py-section-md sm:px-10 lg:px-14 xl:px-20"
          >
            <div className="flex flex-col">
              <motion.p
                variants={staggerItem}
                className="mb-5 font-ui text-eyebrow font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]"
              >
                Who We Are
              </motion.p>

              {/* Headline — cross-fades between slides */}
              <motion.div
                variants={staggerItem}
                className="relative"
                // eslint-disable-next-line no-restricted-syntax
                style={{ minHeight: 'clamp(7rem, 14vw, 11rem)' }}
              >
                {SLIDES.map((s, i) => (
                  <h2
                    key={i}
                    className="absolute font-headline font-normal leading-[1.05] text-white"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{
                      fontSize: 'var(--type-display-md)',
                      opacity: i === active ? 1 : 0,
                      transform:
                        i === active
                          ? 'translateY(0)'
                          : i < active
                            ? 'translateY(-6%)'
                            : 'translateY(6%)',
                      transition: 'opacity 0.55s ease, transform 0.55s ease',
                      pointerEvents: i === active ? 'auto' : 'none',
                    }}
                  >
                    {s.headline.split('\n').map((line, li) => (
                      <span key={li} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                ))}
              </motion.div>

              {/* Gold rule */}
              <motion.span
                variants={staggerItem}
                className="mt-8 block h-[2px] w-12 bg-[var(--app-primary)]"
                aria-hidden="true"
              />

              {/* Description */}
              <motion.div
                variants={staggerItem}
                className="relative mt-6"
                // eslint-disable-next-line no-restricted-syntax
                style={{ minHeight: '9rem' }}
              >
                {SLIDES.map((s, i) => (
                  <p
                    key={i}
                    className="absolute max-w-[380px] font-ui text-body-md leading-[1.9] text-white/60"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{
                      opacity: i === active ? 1 : 0,
                      transform:
                        i === active ? 'translateY(0)' : 'translateY(6px)',
                      transition:
                        'opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s',
                      pointerEvents: i === active ? 'auto' : 'none',
                    }}
                  >
                    {s.description}
                  </p>
                ))}
              </motion.div>

              {/* Manual navigation */}
              <motion.div
                variants={staggerItem}
                className="mt-8 flex items-center gap-4"
              >
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  aria-label="Previous"
                  className="grid h-9 w-9 flex-none place-items-center rounded-full border border-white/15 text-white/50 transition hover:border-[var(--app-primary)]/60 hover:text-[var(--app-primary)]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>

                <div
                  className="flex items-center gap-2"
                  role="tablist"
                  aria-label="What we do slides"
                >
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => goTo(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active
                          ? 'w-6 bg-[var(--app-primary)]'
                          : 'w-1.5 bg-white/20 hover:bg-white/35'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  aria-label="Next"
                  className="grid h-9 w-9 flex-none place-items-center rounded-full border border-white/15 text-white/50 transition hover:border-[var(--app-primary)]/60 hover:text-[var(--app-primary)]"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div variants={staggerItem} className="mt-10">
              <Link
                href="/about"
                className="group inline-flex h-11 items-center gap-2 bg-[var(--app-primary)] px-6 font-ui text-body-sm font-bold text-[var(--app-ink)] transition hover:bg-[var(--app-primary-light)]"
              >
                Our Story
                <ArrowRight className="h-3.5 w-3.5 transition duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Right — sliding editorial photos ────────────────── */}
          <motion.div
            variants={staggerItem}
            initial="hidden"
            whileInView="show"
            viewport={staggerViewport}
            className="relative min-h-[360px] overflow-hidden border-l border-white/[0.05] lg:min-h-0"
          >
            {SLIDES.map((s, i) => {
              const src =
                typeof s.image === 'string'
                  ? s.image
                  : (s.image as { src: string }).src;
              return (
                <div
                  key={i}
                  className="absolute inset-0 transition-opacity duration-700"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{
                    opacity: i === active ? 1 : 0,
                    zIndex: i === active ? 1 : 0,
                  }}
                  aria-hidden={i !== active}
                >
                  <Image
                    src={src}
                    alt={s.imageAlt || 'The Wisdom Church'}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={IMAGE_QUALITY}
                    priority={i === 0}
                    className="object-cover object-[center_14%] sm:object-[center_18%] lg:object-[center_20%]"
                  />
                  {/* Heavy dark base — image is visible but dramatically darkened */}
                  <div className="absolute inset-0 bg-black/65" />
                  {/* Left-to-right blend into content column */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--app-dark)]/95 via-[var(--app-dark)]/55 to-[var(--app-dark)]/25" />
                  {/* Bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-dark)]/90 via-transparent to-transparent" />
                  {/* Top vignette */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--app-dark)]/60 to-transparent" />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
