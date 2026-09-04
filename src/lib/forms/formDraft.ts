/**
 * Per-form draft persistence for the public form renderer. Every answer is
 * mirrored to the device as the member types so a refresh, a network drop, or
 * an accidental tab close never loses what they entered — mirrors the
 * try/catch localStorage pattern the old children's-registration modal used.
 *
 * Image answers are excluded: a `File` (and the ImageFieldValue objects that
 * wrap one) cannot round-trip through JSON, and the field already uploads on
 * selection, so there is nothing time-sensitive to preserve there.
 */

const DRAFT_PREFIX = 'wc:form-draft:';

function draftKey(slug: string): string {
  return `${DRAFT_PREFIX}${slug}`;
}

function isPlainSerializable(value: unknown): boolean {
  if (value === null) return true;
  if (typeof value === 'string' || typeof value === 'boolean') return true;
  if (Array.isArray(value))
    return value.every(item => typeof item === 'string');
  return false;
}

/** Strip File/ImageFieldValue answers before persisting — only plain text,
 *  booleans, and string arrays (checkbox groups) survive. */
export function sanitizeDraftAnswers(
  answers: Record<string, unknown>
): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(answers)) {
    if (isPlainSerializable(value)) clean[key] = value;
  }
  return clean;
}

export function readFormDraft(slug: string): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(draftKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function writeFormDraft(
  slug: string,
  answers: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = sanitizeDraftAnswers(answers);
    const hasEntries = Object.values(clean).some(value =>
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    );
    if (!hasEntries) {
      window.localStorage.removeItem(draftKey(slug));
      return;
    }
    window.localStorage.setItem(draftKey(slug), JSON.stringify(clean));
  } catch {
    /* private mode / quota — the in-memory form still holds the entries */
  }
}

export function clearFormDraft(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(draftKey(slug));
  } catch {
    /* no-op */
  }
}
