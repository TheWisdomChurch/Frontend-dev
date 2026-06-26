'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';

import { Bishop } from '@/shared/assets';
import { seniorPastorData } from '@/lib/data';
import { useSeniorPastor } from '@/shared/utils/hooks/useSeniorPastor';
import { Section, Container } from '@/shared/layout';
import { cn } from '@/lib/cn';

interface SeniorPastorProps {
  className?: string;
}

export default function SeniorPastor({ className = '' }: SeniorPastorProps) {
  const { sectionRef, isVisible } = useSeniorPastor();
  const contentRef = useRef<HTMLDivElement>(null);

  const bio = useMemo(
    () =>
      seniorPastorData?.description?.[0]?.replace(/\s+/g, ' ').trim() ||
      'Bishop Gabriel Ayilara leads The Wisdom House Church with practical teaching, prayer, and a heart for raising strong believers and families.',
    []
  );

  useEffect(() => {
    if (!isVisible || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, [isVisible]);

  return (
    <Section
      ref={sectionRef}
      padding="none"
      className={cn(
        'relative w-full overflow-hidden bg-[var(--app-dark)]',
        className
      )}
    >
      <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-2 lg:min-h-[640px]">
        {/* ── Left — full-height portrait ───────────────────── */}
        <div className="relative order-1 min-h-[420px] overflow-hidden lg:order-none lg:min-h-0">
          <Image
            src={Bishop}
            alt="Bishop Gabriel Ayilara — Senior Pastor, The Wisdom Church"
            fill
            priority={false}
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
            className="object-cover [object-position:center_18%]"
          />
          {/* Subtle right fade on desktop — blends into content panel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[var(--app-dark)]/60" />
        </div>

        {/* ── Right — content ───────────────────────────────── */}
        <div
          ref={contentRef}
          className="order-2 flex flex-col justify-center px-6 py-section-md sm:px-10 lg:order-none lg:px-14 xl:px-20"
        >
          <p className="mb-5 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Senior Pastor
          </p>

          <h2
            className="font-headline font-normal text-white"
            style={{ fontSize: 'var(--type-display-sm)' }}
          >
            Bishop Gabriel Ayilara
          </h2>

          {/* Pull quote */}
          <blockquote className="relative mt-8">
            <span
              className="pointer-events-none absolute -left-2 -top-6 font-headline text-[5rem] leading-none text-[var(--app-primary)] opacity-20"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="font-headline text-[1.2rem] font-normal italic leading-[1.55] text-white/80 sm:text-[1.35rem]">
              You are not just a member, you are a carrier of God&rsquo;s glory.
            </p>
          </blockquote>

          {/* Gold rule */}
          <span
            className="mt-7 block h-[2px] w-12 bg-[var(--app-primary)]"
            aria-hidden="true"
          />

          <p className="mt-6 max-w-[400px] text-[0.95rem] leading-[1.8] text-white/55">
            {bio}
          </p>

          {/* Links */}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href="/leadership"
              className="group inline-flex items-center gap-2 text-[0.78rem] font-semibold text-[var(--app-primary)] transition"
            >
              Meet the team
              <span className="transition duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {[
                {
                  label: 'Instagram',
                  href: 'https://www.instagram.com/gabrielayilara',
                },
                { label: 'Facebook', href: 'https://facebook.com' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.75rem] text-white/35 transition hover:text-white/70"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
