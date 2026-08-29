'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';

type GalleryImage = { src: string; alt: string };

const INTERVAL_MS = 5000;

/**
 * Auto-advancing photo slideshow. Every image is shown in full (`object-contain`)
 * over a blurred copy of itself, so nothing is ever cropped and the frame is
 * never letterboxed. Pauses on hover / focus, and stops auto-advancing when the
 * viewer prefers reduced motion.
 */
export default function MinistryGallery({
  images,
}: {
  images: readonly GalleryImage[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const go = useCallback(
    (next: number) => setIndex((next + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count < 2) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const id = window.setInterval(
      () => setIndex(i => (i + 1) % count),
      INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [paused, count, index]);

  if (count === 0) return null;

  return (
    <div
      className="select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-image bg-[var(--app-dark-2)] sm:aspect-[16/10]"
        role="group"
        aria-roledescription="carousel"
        aria-label="Ministry photographs"
      >
        {images.map((image, i) => (
          <div
            key={image.src}
            aria-hidden={i !== index}
            className={cn(
              'absolute inset-0 transition-opacity duration-[800ms] ease-out motion-reduce:transition-none',
              i === index ? 'opacity-100' : 'opacity-0'
            )}
          >
            {/* Blurred fill — removes the letterbox bars */}
            <Image
              src={image.src}
              alt=""
              aria-hidden
              fill
              sizes="12vw"
              quality={20}
              className="scale-110 object-cover blur-2xl opacity-40"
            />
            {/* The photo itself — always fully visible */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1023px) 100vw, 60vw"
              quality={IMAGE_QUALITY}
              className="object-contain"
            />
          </div>
        ))}

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1} of ${count}`}
                  aria-current={i === index}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === index
                      ? 'w-6 bg-[var(--app-primary)]'
                      : 'w-1.5 bg-white/50 hover:bg-white/80'
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <p
        className="mt-3 font-ui text-caption leading-relaxed text-[var(--app-subtle)]"
        aria-live="polite"
      >
        {images[index].alt}
      </p>
    </div>
  );
}
