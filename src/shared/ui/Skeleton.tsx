interface SkeletonProps {
  className?: string;
}

export function SkeletonImage({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-white/8 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = '',
}: SkeletonProps & { lines?: number }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 animate-pulse rounded bg-white/8 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`overflow-hidden border border-white/8 bg-white/[0.03] ${className}`}
      aria-hidden="true"
    >
      <div className="h-[180px] animate-pulse bg-white/8" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/8" />
        <div className="h-3 w-full animate-pulse rounded bg-white/8" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/8" />
        <div className="mt-4 h-9 w-28 animate-pulse rounded bg-white/8" />
      </div>
    </div>
  );
}

export function SkeletonCardCanvas({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`overflow-hidden border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)] ${className}`}
      aria-hidden="true"
    >
      <div className="h-[180px] animate-pulse bg-[var(--app-ink)]/8" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--app-ink)]/8" />
        <div className="h-3 w-full animate-pulse rounded bg-[var(--app-ink)]/8" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--app-ink)]/8" />
      </div>
    </div>
  );
}
