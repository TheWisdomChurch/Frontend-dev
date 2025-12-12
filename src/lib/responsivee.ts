// lib/responsive.ts
export const responsive = {
  heading: {
    mobile: 'text-lg',
    tablet: 'text-xl',
    desktop: 'text-2xl'
  },
  body: {
    mobile: 'text-xs',
    tablet: 'text-sm',
    desktop: 'text-base'
  },
  price: {
    mobile: 'text-lg',
    tablet: 'text-xl',
    desktop: 'text-2xl'
  },
  button: {
    mobile: 'py-2.5 text-sm',
    tablet: 'py-3 text-base',
    desktop: 'py-3.5 text-base'
  },
  modal: {
    mobile: 'max-h-[85vh] rounded-t-2xl rounded-b-none',
    tablet: 'max-h-[90vh] max-w-lg rounded-2xl',
    desktop: 'max-h-[90vh] max-w-xl rounded-2xl'
  },
  image: {
    mobile: 'h-56',
    tablet: 'h-64',
    desktop: 'h-72'
  },
  padding: {
    mobile: 'p-4',
    tablet: 'p-6',
    desktop: 'p-8'
  },
  gap: {
    mobile: 'gap-3',
    tablet: 'gap-4',
    desktop: 'gap-5'
  }
} as const;

export type ResponsiveValue<T extends keyof typeof responsive> = typeof responsive[T];
export type ViewportSize = 'mobile' | 'tablet' | 'desktop';