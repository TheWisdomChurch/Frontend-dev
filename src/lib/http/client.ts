import { trackApiRequestEnd, trackApiRequestStart } from '@/lib/apiActivity';
import { HttpError, getErrorMessage, isHttpError } from './errors';
import {
  extractValidationErrors,
  getPayloadMessage,
  parseResponseBody,
  unwrapData,
} from './response';

export interface HttpClientConfig {
  baseUrl: string;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  cacheTtlMs?: number;
}

export interface HttpRequestOptions extends RequestInit {
  skipCache?: boolean;
  unwrap?: boolean;
}

type CacheEntry = { value: unknown; expiresAt: number };

const delay = (milliseconds: number) =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

function requestSignal(
  signal: AbortSignal | null | undefined,
  timeoutMs: number
) {
  const timeout = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

export function createHttpClient(config: HttpClientConfig) {
  const cache = new Map<string, CacheEntry>();
  const timeoutMs = config.timeoutMs ?? 30_000;
  const maxAttempts = Math.max(1, config.retries ?? 3);
  const retryDelayMs = config.retryDelayMs ?? 1_000;
  const cacheTtlMs = config.cacheTtlMs ?? 5 * 60_000;

  async function request<T>(
    path: string,
    options: HttpRequestOptions = {}
  ): Promise<T> {
    const {
      skipCache = false,
      unwrap = false,
      signal,
      headers: customHeaders,
      ...fetchOptions
    } = options;
    const method = (options.method || 'GET').toUpperCase();
    const isIdempotent = method === 'GET' || method === 'HEAD';
    const cacheKey = `${method}:${path}`;

    if (isIdempotent && !skipCache) {
      const cached = cache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) return cached.value as T;
      if (cached) cache.delete(cacheKey);
    }

    const isFormData =
      typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;
    const headers = new Headers(customHeaders);
    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');

    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (attempt > 0) await delay(retryDelayMs * 2 ** (attempt - 1));

      trackApiRequestStart();
      try {
        const response = await fetch(`${config.baseUrl}${path}`, {
          ...fetchOptions,
          method,
          headers,
          credentials: options.credentials ?? 'include',
          cache: options.cache ?? 'no-store',
          signal: requestSignal(signal, timeoutMs),
        });
        const payload = await parseResponseBody(response);

        if (!response.ok) {
          const error = new HttpError(
            getPayloadMessage(payload) || `Request failed (${response.status})`,
            {
              statusCode: response.status,
              details: payload,
              validationErrors: extractValidationErrors(payload),
            }
          );
          if (
            isIdempotent &&
            response.status >= 500 &&
            attempt < maxAttempts - 1
          ) {
            lastError = error;
            continue;
          }
          throw error;
        }

        const value = unwrap ? unwrapData<unknown>(payload) : payload;
        if (isIdempotent && !skipCache) {
          cache.set(cacheKey, { value, expiresAt: Date.now() + cacheTtlMs });
        }
        return value as T;
      } catch (error) {
        lastError = error;
        if (signal?.aborted) {
          throw new HttpError('Request cancelled', {
            statusCode: 0,
            details: error,
            cause: error,
          });
        }
        if (isHttpError(error) && error.statusCode < 500) throw error;
        if (!isIdempotent || attempt === maxAttempts - 1) {
          if (isHttpError(error)) throw error;
          throw new HttpError(getErrorMessage(error), {
            statusCode: 0,
            details: error,
            cause: error,
          });
        }
      } finally {
        trackApiRequestEnd();
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new HttpError('Request failed after retries', { statusCode: 0 });
  }

  return {
    request,
    clearCache: () => cache.clear(),
  };
}
