/**
 * JavaScript-facing design tokens for third-party APIs that cannot resolve CSS
 * custom properties (for example Google Maps marker configuration).
 * Application UI should use the matching --app-* CSS variables instead.
 */
export const editorialColorToken = {
  brand: '#c9961a',
  white: '#ffffff',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#3b82f6',
} as const;
