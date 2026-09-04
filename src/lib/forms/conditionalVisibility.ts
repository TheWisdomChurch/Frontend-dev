import type { PublicFormField } from '@/lib/apiTypes';

/* ============================================================================
   Conditional-visibility evaluation for public forms. Pure functions only —
   the renderer (src/app/forms/[slug]/page.tsx) and unit tests both import
   these, so nothing here may touch React or the DOM.
============================================================================ */

export function normalizeValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(normalizeValue).filter(Boolean).join('|');
  }

  if (value === null || value === undefined) return '';

  return String(value).trim().toLowerCase();
}

export function asNormalizedList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(normalizeValue).filter(Boolean);
  }

  const normalized = normalizeValue(value);
  return normalized ? [normalized] : [];
}

export function evaluateFieldRule(
  currentValue: unknown,
  operator: string,
  expectedValue?: unknown,
  expectedValues?: unknown[]
): boolean {
  const left = normalizeValue(currentValue);
  const leftList = asNormalizedList(currentValue);
  const right = normalizeValue(expectedValue);
  const rightList = asNormalizedList(expectedValues);
  const op = operator.toLowerCase();

  if (op === 'is_empty') return !left;
  if (op === 'not_empty') return Boolean(left);

  if (op === 'contains' || op === 'includes') {
    if (leftList.length > 1) return leftList.includes(right);
    return left.includes(right);
  }

  if (op === 'not_contains' || op === 'not_includes') {
    if (leftList.length > 1) return !leftList.includes(right);
    return !left.includes(right);
  }

  if (op === 'in') {
    return leftList.some(item => rightList.includes(item));
  }

  if (op === 'not_in') {
    return leftList.every(item => !rightList.includes(item));
  }

  if (op === 'greater_than') return Number(left) > Number(right);
  if (op === 'less_than') return Number(left) < Number(right);

  if (op === 'not_equals' || op === 'not_equal') {
    return !leftList.includes(right);
  }

  if (op === 'equals' && leftList.length > 1) {
    return leftList.includes(right);
  }

  return left === right;
}

export function isFieldVisible(
  field: PublicFormField,
  answers: Record<string, unknown>
): boolean {
  const conditional = field.conditional;

  if (
    !conditional ||
    !Array.isArray(conditional.rules) ||
    conditional.rules.length === 0
  ) {
    return true;
  }

  const matchMode =
    String(conditional.match || 'all').toLowerCase() === 'any' ? 'any' : 'all';

  const mode =
    String(conditional.mode || 'show').toLowerCase() === 'hide'
      ? 'hide'
      : 'show';

  const didMatch =
    matchMode === 'any'
      ? conditional.rules.some(rule =>
          evaluateFieldRule(
            answers[rule.fieldKey],
            rule.operator || 'equals',
            rule.value,
            rule.values
          )
        )
      : conditional.rules.every(rule =>
          evaluateFieldRule(
            answers[rule.fieldKey],
            rule.operator || 'equals',
            rule.value,
            rule.values
          )
        );

  return mode === 'hide' ? !didMatch : didMatch;
}
