'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';

type GalleryImage = { src: string; alt: string };

const INTERVAL_MS = 5500;
const FALLBACK_RATIO = 1.4;
// Keep the frame sane if a stray panorama or very tall portrait shows up.
const MIN_RATIO = 0.62;
const MAX_RATIO = 2;

/**
 * Auto-advancing slideshow whose frame resizes to match each photo's real
 * aspect ratio — so `object-cover` fills the frame edge to edge with no
 * cropping and no letterbox bars, whatever mix of portrait / landscape /
 * square photos it is given. Pauses on hover / focus; stops auto-advancing
 * under reduced motion.
 */
export default function MinistryGallery({
  images,
}: {
  images: readonly GalleryImage[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ratios, setRatios] = useState<Record<number, number>>({});
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

  const raw = ratios[index] ?? FALLBACK_RATIO;
  const ratio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, raw));

  return (
    <div
      className="select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="relative aspect-[var(--frame-ratio)] w-full overflow-hidden rounded-image bg-[var(--app-dark-2)] transition-[aspect-ratio] duration-500 ease-out"
        style={{ '--frame-ratio': String(ratio) } as CSSProperties}
        role="group"
        aria-roledescription="carousel"
        aria-label="Ministry photographs"
      >
        {images.map((image, i) => (
          <Image
            key={image.src}
            src={image.src}
            alt={i === index ? image.alt : ''}
            fill
            priority={i === 0}
            sizes="(max-width: 1023px) 100vw, 55vw"
            quality={IMAGE_QUALITY}
            onLoad={event => {
              const el = event.currentTarget;
              if (el.naturalWidth && el.naturalHeight) {
                setRatios(current =>
                  current[i]
                    ? current
                    : { ...current, [i]: el.naturalWidth / el.naturalHeight }
                );
              }
            }}
            className={cn(
              'object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none',
              i === index ? 'opacity-100' : 'opacity-0'
            )}
          />
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
