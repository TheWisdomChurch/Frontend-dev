interface SectionGlowProps {
  variant?: 'single' | 'double';
  className?: string;
}

// One or two soft, blurred radial accents for dark sections that would
// otherwise be flat color — same visual language established this session
// in PromoAdModal/ConfessionPopup, generalized for reuse across the
// homepage instead of flat backgrounds.
export default function SectionGlow({
  variant = 'single',
  className = '',
}: SectionGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[var(--app-primary)]/10 blur-3xl" />
      {variant === 'double' && (
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[var(--app-primary)]/[0.07] blur-3xl" />
      )}
    </div>
  );
}
