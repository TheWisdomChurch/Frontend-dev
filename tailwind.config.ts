import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // Tailwind's default opacity scale only covers 5% steps (0,5,10,...,100),
      // so a bare-number color-opacity modifier like `text-white/52` or
      // `border-white/12` silently compiles to no CSS at all when the number
      // isn't in that scale — the element then falls back to an inherited
      // color with no build warning. Extending the scale to every integer
      // 0-100 makes any `/N` modifier work, matching what authors actually
      // expect from the slash-opacity syntax.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [i, (i / 100).toString()])
      ),
      fontFamily: {
        // One typeface. `ui` / `headline` / `body` are kept as aliases so
        // existing `font-*` utilities keep working — they all resolve to the
        // single app sans.
        sans: [
          'var(--font-sans)',
          'Inter',
          'SF Pro Text',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        ui: [
          'var(--font-sans)',
          'Inter',
          'SF Pro Text',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        headline: [
          'var(--font-sans)',
          'Inter',
          'SF Pro Text',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        body: [
          'var(--font-sans)',
          'Inter',
          'SF Pro Text',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        code: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontWeight: {
        bold: '600',
        extrabold: '800',
        black: '700',
      },
      fontSize: {
        'display-xl': 'var(--type-display-xl)',
        'display-lg': 'var(--type-display-lg)',
        'display-md': 'var(--type-display-md)',
        'display-sm': 'var(--type-display-sm)',
        'heading-lg': 'var(--type-heading-lg)',
        'heading-md': 'var(--type-heading-md)',
        'heading-sm': 'var(--type-heading-sm)',
        lead: 'var(--type-lead)',
        'body-lg': 'var(--type-body-lg)',
        'body-md': 'var(--type-body-md)',
        'body-sm': 'var(--type-body-sm)',
        label: 'var(--type-label)',
        caption: 'var(--type-caption)',
        eyebrow: 'var(--type-eyebrow)',
      },
      spacing: {
        'section-xs': 'var(--section-xs)',
        'section-sm': 'var(--section-sm)',
        'section-md': 'var(--section-md)',
        'section-lg': 'var(--section-lg)',
        'section-xl': 'var(--section-xl)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
        'radius-sm': 'var(--radius-sm)',
        'radius-md': 'var(--radius-md)',
        'radius-lg': 'var(--radius-lg)',
        card: 'var(--radius-card)',
        button: 'var(--radius-button)',
        input: 'var(--radius-input)',
        badge: 'var(--radius-badge)',
        image: 'var(--radius-image)',
      },
    },
  },
  plugins: [],
} satisfies Config;
