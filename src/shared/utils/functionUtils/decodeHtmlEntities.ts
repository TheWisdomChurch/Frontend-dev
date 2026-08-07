const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  '#39': "'",
  nbsp: ' ',
};

/**
 * Decodes the handful of HTML entities that show up in third-party feed
 * titles (e.g. YouTube video titles arrive already entity-encoded, so a
 * title containing "&" renders as the literal text "&amp;" if displayed
 * as-is).
 */
export function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#\d+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity in NAMED_ENTITIES) return NAMED_ENTITIES[entity];
    if (entity.startsWith('#')) {
      const code = Number(entity.slice(1));
      return Number.isFinite(code) ? String.fromCharCode(code) : match;
    }
    return match;
  });
}
