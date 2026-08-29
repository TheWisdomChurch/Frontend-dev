import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LocationMapProps {
  /** Free-text address or place name to centre the map on. */
  query: string;
  /** Accessible title for the embedded frame. */
  title?: string;
  zoom?: number;
  className?: string;
}

/**
 * Keyless Google Maps embed with a graceful "open in Maps" affordance. No API
 * key, no client JS — just an iframe, so it works in any environment as long
 * as `frame-src https://www.google.com` is allowed by the CSP.
 */
export function LocationMap({
  query,
  title = 'Location map',
  zoom = 15,
  className,
}: LocationMapProps) {
  const encoded = encodeURIComponent(query);
  const embedSrc = `https://www.google.com/maps?q=${encoded}&z=${zoom}&output=embed`;
  const openHref = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-card border border-[var(--app-border)] bg-[var(--app-canvas-2)]',
        'aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]',
        className
      )}
    >
      <iframe
        src={embedSrc}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.2)_contrast(1.05)]"
      />
      <a
        href={openHref}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-button border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 font-ui text-label font-semibold text-[var(--app-ink)] shadow-sm transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)]"
      >
        Open in Maps
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export default LocationMap;
