// Shared scroll-reveal cascade tokens — a section wraps its content in
// `staggerContainer` (whileInView) and marks each direct child that should
// cascade in with `staggerItem`, instead of the whole section fading in as
// one flat block.
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const staggerViewport = { once: true, amount: 0.25 } as const;
