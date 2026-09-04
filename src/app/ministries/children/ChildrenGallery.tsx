'use client';

import { useState } from 'react';
import Image from 'next/image';

import { IMAGE_QUALITY } from '@/shared/constants';

const slides = [
  {
    src: '/Picflow/children-group.webp',
    alt: "The children's class at The Wisdom Church, Lagos",
  },
  {
    src: '/Picflow/child.webp',
    alt: 'A toddler at play in the nursery at The Wisdom Church',
  },
  {
    src: '/Picflow/child2.webp',
    alt: 'A child dressed for Sunday at The Wisdom Church children’s ministry',
  },
  {
    src: '/Picflow/children-hero.webp',
    alt: 'A young girl in her Sunday best at The Wisdom Church',
  },
];

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChildrenGallery() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent(c => (c + 1) % slides.length);

  return (
    <div className="relative select-none">
      {/* Slides */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-image sm:aspect-[16/10] lg:aspect-[16/9]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover object-[center_28%]"
              priority={i === 0}
              sizes="100vw"
              quality={IMAGE_QUALITY}
            />
            {/* Bottom vignette so dots stay legible */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ))}

        {/* Prev button */}
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/35 text-white backdrop-blur-sm transition duration-150 hover:bg-black/60"
        >
          <ChevronLeft />
        </button>

        {/* Next button */}
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/35 text-white backdrop-blur-sm transition duration-150 hover:bg-black/60"
        >
          <ChevronRight />
        </button>

        {/* Dot indicators — inside image, bottom-left */}
        <div className="absolute bottom-5 left-6 z-10 flex items-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-[2px] transition-all duration-400 ${
                i === current
                  ? 'w-8 bg-[var(--app-primary)]'
                  : 'w-4 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
