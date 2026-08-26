export type EditorialTone = 'surface' | 'canvas' | 'muted' | 'dark' | 'brand';

export type EditorialWidth = 'narrow' | 'content' | 'wide';

export const editorialToneClass: Record<EditorialTone, string> = {
  surface: 'bg-[var(--app-surface)] text-[var(--app-ink)]',
  canvas: 'bg-[var(--app-canvas)] text-[var(--app-ink)]',
  muted: 'bg-[var(--app-canvas-2)] text-[var(--app-ink)]',
  dark: 'bg-[var(--app-dark)] text-white',
  brand: 'bg-[var(--app-primary)] text-[var(--app-ink)]',
};

export const editorialWidthClass: Record<EditorialWidth, string> = {
  narrow: 'max-w-3xl',
  content: 'max-w-5xl',
  wide: 'max-w-7xl',
};

export const editorialActionClass = {
  primary:
    'inline-flex min-h-12 items-center justify-center rounded-button bg-[var(--app-primary)] px-7 font-ui text-label font-bold uppercase tracking-widest text-[var(--app-ink)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)]',
  dark: 'inline-flex min-h-12 items-center justify-center rounded-button bg-[var(--app-dark)] px-7 font-ui text-label font-bold uppercase tracking-widest text-white transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-dark)]',
  outline:
    'inline-flex min-h-12 items-center justify-center rounded-button border border-current/35 bg-transparent px-7 font-ui text-label font-bold uppercase tracking-widest text-current transition hover:-translate-y-0.5 hover:border-current/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
} as const;

export const editorialFieldClass =
  'w-full rounded-input border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 font-ui text-body-sm text-[var(--app-ink)] placeholder:text-[var(--app-subtle)] outline-none transition focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary)]/15';

export const editorialLabelClass =
  'block font-ui text-eyebrow font-bold uppercase tracking-[0.18em] text-[var(--app-subtle)]';

export const editorialChoiceClass =
  'flex min-h-11 items-center gap-3 rounded-input border border-[var(--app-border)] bg-[var(--app-canvas)] px-3 py-2 font-ui text-body-sm text-[var(--app-muted)] transition hover:border-[var(--app-primary)] hover:bg-[var(--app-surface)]';

export const editorialHelpClass =
  'font-ui text-caption leading-relaxed text-[var(--app-subtle)]';

export const editorialErrorClass =
  'font-ui text-body-sm font-semibold text-[var(--status-error)]';
