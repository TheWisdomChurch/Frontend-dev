import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface MarqueeProps {
  /** Words / phrases to scroll across, TV-chyron style. */
  items: readonly string[];
  /** Seconds for one full pass — lower is faster. */
  speedSeconds?: number;
  /** Node rendered between every item (defaults to a small gold dot). */
  separator?: ReactNode;
  className?: string;
  itemClassName?: string;
}

/**
 * Continuous horizontal ticker. Pure CSS animation (no JS), pauses on hover,
 * and freezes to a static row under `prefers-reduced-motion` via the global
 * reset in globals.scss. The track is duplicated for a seamless loop; the
 * second copy is hidden from assistive tech.
 */
export function Marquee({
  items,
  speedSeconds = 32,
  separator,
  className,
  itemClassName,
}: MarqueeProps) {
  const dot = (
    <span
      aria-hidden="true"
      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--app-primary)]"
    />
  );
  const sep = separator ?? dot;

  const track = (copy: 'a' | 'b') => (
    <div
      className="marquee__track"
      aria-hidden={copy === 'b' ? 'true' : undefined}
    >
      {items.map((item, i) => (
        <Fragment key={`${copy}-${i}`}>
          <span
            className={cn(
              'whitespace-nowrap font-ui text-heading-md font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]',
              itemClassName
            )}
          >
            {item}
          </span>
          {sep}
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={cn('marquee', className)}
      style={{ '--marquee-duration': `${speedSeconds}s` } as CSSProperties}
    >
      {track('a')}
      {track('b')}
    </div>
  );
}

export default Marquee;
