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
   * object-[center_8%]), hover transforms, etc. Cover is the default; use
   * `fit="contain"` for products, logos, and artwork that must not be cropped.
   * Pair cover images with a frame
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
  /** Use contain for artwork/logos that must remain fully visible. */
  fit?: 'cover' | 'contain';
}

/**
 * Shared responsive frame for content images. A failed or missing src never
 * falls through to the browser's
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
  fit = 'cover',
}: MediaProps) {
  const sourceKey = typeof src === 'string' ? src : src?.src;
  // CMS / form-uploaded images are served from storage hosts we can't
  // enumerate ahead of time in next.config, and leadership-form uploads can
  // even arrive as inline `data:`/`blob:` URIs. The Next optimizer rejects
  // data URIs outright and 400s on unlisted hosts, so skip it for anything
  // that isn't a local bundled asset — those (hero art, Picflow) keep full
  // optimization.
  const isRemote =
    typeof src === 'string' && /^(https?:|blob:|data:|\/\/)/i.test(src);
  const [failedSource, setFailedSource] = useState<string>();
  const [loadedSource, setLoadedSource] = useState<string>();
  const failed = failedSource === sourceKey;
  const loaded = loadedSource === sourceKey;

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
            className="h-8 w-8 text-[color-mix(in_srgb,var(--app-ink)_60%,transparent)]"
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
        unoptimized={isRemote}
        onLoad={() => setLoadedSource(sourceKey)}
        onError={() => setFailedSource(sourceKey)}
        className={cn(
          'h-full w-full',
          fit === 'contain' ? 'object-contain' : 'object-cover',
          className
        )}
      />
    </div>
  );
}
