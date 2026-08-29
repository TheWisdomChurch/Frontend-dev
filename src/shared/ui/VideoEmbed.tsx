import { cn } from '@/lib/cn';

interface VideoEmbedProps {
  /** A full embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID). */
  src: string;
  title: string;
  className?: string;
}

/**
 * Lazy 16:9 video frame. YouTube / youtube-nocookie are the hosts allowed by
 * the CSP `frame-src`.
 */
export function VideoEmbed({ src, title, className }: VideoEmbedProps) {
  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-image border border-[var(--app-border)] bg-[var(--app-dark-2)]',
        className
      )}
    >
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

export default VideoEmbed;
