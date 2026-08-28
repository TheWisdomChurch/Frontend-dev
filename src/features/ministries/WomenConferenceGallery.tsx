'use client';

import { useState } from 'react';

import { Figure } from '@/shared/ui/layout';
import { cn } from '@/lib/cn';

type GalleryImage = { src: string; alt: string };

export default function WomenConferenceGallery({
  images,
}: {
  images: readonly GalleryImage[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <Figure
        src={active.src}
        alt={active.alt}
        fill
        sizes="(max-width: 1023px) 100vw, 60vw"
        className="aspect-[4/3] sm:aspect-[16/10]"
        imageClassName="transition-opacity duration-300"
      />
      <div
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
        role="tablist"
        aria-label="Conference photographs"
      >
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`View image ${index + 1}: ${image.alt}`}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'relative aspect-[4/3] overflow-hidden rounded-image border-2 transition',
              index === activeIndex
                ? 'border-[var(--app-primary)]'
                : 'border-transparent opacity-60 hover:opacity-100'
            )}
          >
            <Figure
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 12vw"
              className="absolute inset-0 rounded-none"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
