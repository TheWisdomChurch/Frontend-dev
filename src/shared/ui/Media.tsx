'use client';

import { useState, type ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';

interface MediaProps {
  src?: string | StaticImageData | null;
  alt: string;
  /**
   * Applied to the <Image> itself — object-position (e.g. object-top,
   * object-[center_8%]), hover transforms, etc. Fit is always cover: the
   * frame is filled edge-to-edge and cropped, at every source aspect ratio,
   * with no letterboxing and no partially-empty sides. Pair with a frame
   * whose aspect ratio suits the content (aspect-square, aspect-[4/5], a
   * fixed height) and an object-position tuned to the subject so cropping
   * lands where it should.
   */
  className?: string;
  /** Applied to the outer frame — corner radius, border, aspect-ratio. */
  frameClassName?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fallback?: ReactNode;
}

/**
 * Single frame every image on the site renders through. Always fills its
 * frame edge-to-edge (object-cover) — no letterboxing, no blurred backdrop,
 * no visible gaps on any side regardless of the uploaded source's aspect
 * ratio. A failed or missing src never falls through to the browser's
 * broken-image icon; it renders a neutral placeholder instead.
 */
export function Media({
  src,
  alt,
  className,
  frameClassName,
  sizes = '(max-width: 640px) 100vw, 50vw',
  priority,
  quality = IMAGE_QUALITY,
  fallback,
}: MediaProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-center bg-[var(--app-canvas-2)]',
          frameClassName
        )}
      >
        {fallback ?? (
          <ImageOff
            className="h-8 w-8 text-[var(--app-ink)]/20"
            aria-hidden="true"
          />
        )}
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', frameClassName)}
    >
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-[var(--app-canvas-2)]"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn('object-cover', className)}
      />
    </div>
  );
}
