export const motionEase = [0.22, 1, 0.36, 1] as const;

export const motionDuration = {
  fast: 0.24,
  base: 0.48,
  slow: 0.72,
} as const;

export const motionDistance = {
  subtle: 12,
  base: 24,
  expressive: 36,
} as const;

export const motionStagger = {
  tight: 0.045,
  base: 0.08,
  relaxed: 0.12,
} as const;
