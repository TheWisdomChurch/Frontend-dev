import type { ValidationFieldError } from './errors';

export type JsonRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json().catch(() => null);
  }

  const text = await response.text().catch(() => '');
  return text ? { message: text } : null;
}

export function getPayloadMessage(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined;
  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error.trim();
  }
  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }
  return undefined;
}

export function extractValidationErrors(
  payload: unknown
): ValidationFieldError[] | undefined {
  if (!isRecord(payload) || !Array.isArray(payload.errors)) return undefined;

  const errors = payload.errors.flatMap(item => {
    if (!isRecord(item) || typeof item.field !== 'string') return [];
    const field = item.field.trim();
    if (!field) return [];

    return [
      {
        field,
        message:
          typeof item.message === 'string' && item.message.trim()
            ? item.message.trim()
            : 'Invalid value',
        code:
          typeof item.code === 'string' && item.code.trim()
            ? item.code.trim()
            : undefined,
      },
    ];
  });

  return errors.length ? errors : undefined;
}

export function unwrapData<T>(payload: unknown): T {
  if (!isRecord(payload) || !('data' in payload)) return payload as T;
  const data = payload.data;
  return isRecord(data) && 'data' in data ? (data.data as T) : (data as T);
}

export function extractArrayData<T>(payload: unknown): T[] {
  const data = unwrapData<unknown>(payload);
  if (Array.isArray(data)) return data as T[];
  if (!isRecord(data)) return [];

  for (const candidate of [data.items, data.results, data.rows]) {
    if (Array.isArray(candidate)) return candidate as T[];
  }
  return [];
}

export function toQueryString(params: Record<string, unknown>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    query.set(key, String(value));
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
}
