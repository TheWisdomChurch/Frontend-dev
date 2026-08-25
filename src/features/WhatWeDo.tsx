'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { whatWeDoData } from '@/lib/data';
import { IMAGE_QUALITY } from '@/shared/constants';
import { Container, Section } from '@/shared/layout';

const PILLARS = whatWeDoData.slice(0, 4).map((item, index) => ({
  ...item,
  headline:
    [
      'Believers, not just members.',
      'A people of prayer.',
      'Wholehearted worship.',
      'Shaped by the living Word.',
    ][index] ?? item.title,
}));

export default function WhatWeDo() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="what-we-do"
      padding="none"
      fullHeight={false}
      perf="none"
      className="relative bg-[var(--app-dark)] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(201,150,26,0.12),transparent_30%)]"
      />

      <Container
        size="xl"
        className="relative px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32"
      >
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col gap-8 border-b border-white/15 pb-12 md:mb-0 md:grid md:grid-cols-12 md:items-end md:gap-6 md:pb-16"
        >
          <div className="md:col-span-3">
            <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.24em] text-[var(--app-primary)]">
              Who we are
            </p>
          </div>

          <div className="md:col-span-7">
            <h2 className="max-w-4xl font-headline text-[clamp(2.65rem,6vw,6.5rem)] font-normal leading-[0.94] tracking-[-0.045em] text-white">
              Faith made visible
              <span className="block text-white/38">in everyday life.</span>
            </h2>
          </div>

          <div className="md:col-span-2 md:flex md:justify-end">
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 border-b border-[var(--app-primary)] pb-2 font-ui text-sm font-semibold text-white transition-colors duration-300 hover:text-[var(--app-primary-light)]"
            >
              Our story
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.header>

        <div className="divide-y divide-white/15 border-b border-white/15 md:divide-y-0 md:border-b-0">
          {PILLARS.map((pillar, index) => {
            const src =
              typeof pillar.image === 'string'
                ? pillar.image
                : (pillar.image as { src: string }).src;

            return (
              <motion.article
                key={pillar.id}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.65,
                  delay: reduceMotion ? 0 : index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col gap-7 py-10 md:grid md:min-h-[270px] md:grid-cols-11 md:items-center md:gap-6 md:border-b md:border-white/15 md:py-9"
              >
                <div className="md:col-span-4">
                  <p className="mb-3 font-ui text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--app-primary)]/85">
                    {pillar.title}
                  </p>
                  <h3 className="max-w-md font-headline text-[clamp(1.9rem,3vw,3.3rem)] font-normal leading-[1.02] tracking-[-0.035em] text-white transition-colors duration-500 group-hover:text-[var(--app-primary-light)]">
                    {pillar.headline}
                  </h3>
                </div>

                <div className="md:col-span-4">
                  <p className="max-w-xl font-ui text-sm leading-7 text-white/58 sm:text-[0.95rem] sm:leading-8">
                    {pillar.description}
                  </p>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden bg-white/5 md:col-span-3 md:aspect-[5/3]">
                  <Image
                    src={src}
                    alt={pillar.imageAlt || pillar.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 25vw"
                    quality={IMAGE_QUALITY}
                    className="object-cover grayscale-[35%] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.045] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-[var(--app-primary)]/10 transition-opacity duration-500 group-hover:opacity-60" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
