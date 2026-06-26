'use client';

import Image from 'next/image';
import Link from 'next/link';

import { whatWeDoData } from '@/lib/data';
import { Section, Container } from '@/shared/layout';

export default function WhatWeDo() {
  const photo = whatWeDoData[0];

  return (
    <Section
      id="what-we-do"
      padding="none"
      fullHeight={false}
      perf="none"
      className="bg-[var(--app-dark)]"
    >
      <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-2 lg:min-h-[620px]">
        {/* ── Left — content ──────────────────────────────────── */}
        <div className="flex flex-col justify-center px-6 py-section-md sm:px-10 lg:px-14 xl:px-20">
          <p className="mb-5 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Our Purpose
          </p>

          <h2
            className="font-headline font-normal leading-[1.02] text-white"
            style={{ fontSize: 'var(--type-display-md)' }}
          >
            We exist to raise
            <em className="not-italic"> believers</em>,
            <br className="hidden sm:block" /> not just members.
          </h2>

          {/* Gold rule */}
          <span
            className="mt-8 block h-[2px] w-12 bg-[var(--app-primary)]"
            aria-hidden="true"
          />

          <p className="mt-7 max-w-[380px] text-[1rem] leading-[1.8] text-white/60">
            A Spirit-filled community rooted in the Word — equipping every
            member to live with faith, purpose, and a heart for others.
          </p>

          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-2 text-[0.8rem] font-semibold text-[var(--app-primary)] transition"
          >
            Our Story
            <span className="transition duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* ── Right — editorial photo ──────────────────────────── */}
        <div className="relative min-h-[360px] overflow-hidden border-l border-white/[0.06] lg:min-h-0">
          {photo?.image ? (
            <>
              <Image
                src={
                  typeof photo.image === 'string'
                    ? photo.image
                    : (photo.image as { src: string }).src
                }
                alt={photo.imageAlt || 'The Wisdom Church community'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
                className="object-cover [object-position:center_22%]"
              />
              {/* Subtle left fade to blend with content panel */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--app-dark)]/40 via-transparent to-transparent lg:from-[var(--app-dark)]/60" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[var(--app-neutral)]" />
          )}
        </div>
      </div>
    </Section>
  );
}
