/**
 * Sermon titles arrive from YouTube as uploaded, which is typically
 * "{Message Title} | {Church Name} | {Date}" — useful as a searchable
 * video filename, but redundant and unpolished as a display heading next
 * to a card that already shows the church name and a formatted date
 * separately. This keeps just the first, meaningful segment.
 */
export function cleanSermonTitle(rawTitle: string): string {
  const trimmed = rawTitle.trim();
  if (!trimmed.includes('|')) return trimmed;

  const segments = trimmed
    .split('|')
    .map(segment => segment.trim())
    .filter(Boolean);

  return segments[0] || trimmed;
}
