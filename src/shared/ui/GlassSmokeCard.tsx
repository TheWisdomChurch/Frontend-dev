import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface GlassSmokeCardProps {
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  className?: string;
}

/**
 * A plain white editorial card at rest. On hover / keyboard focus a heavy,
 * layered smoke rolls up into frame on a timed cue and the text crossfades to
 * read against it. The whole effect (timing, density, tint, motion) is defined
 * once in globals.scss under `.smoke-panel` — this component only supplies the
 * structure. Under `prefers-reduced-motion` it stays a static white card.
 */
export function GlassSmokeCard({
  eyebrow,
  title,
  body,
  className,
}: GlassSmokeCardProps) {
  return (
    <article tabIndex={0} className={cn('smoke-panel', className)}>
      <div className="smoke-panel__smoke" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <p className="smoke-panel__eyebrow">{eyebrow}</p>
      <h3 className="smoke-panel__title">{title}</h3>
      <p className="smoke-panel__body">{body}</p>
    </article>
  );
}

export default GlassSmokeCard;
