import { trackApiRequestEnd, trackApiRequestStart } from '@/lib/apiActivity';
import {
  HttpError,
  getErrorMessage,
  isHttpError,
  notifyServiceUnavailable,
} from './errors';
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
  maxConcurrentRequests?: number;
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

function retryDelayFromResponse(response: Response, fallbackMs: number) {
  const raw = response.headers.get('retry-after');
  if (!raw) return fallbackMs;

  const seconds = Number(raw);
  if (Number.isFinite(seconds)) {
    return Math.min(Math.max(seconds * 1_000, fallbackMs), 10_000);
  }

  const retryAt = Date.parse(raw);
  if (Number.isNaN(retryAt)) return fallbackMs;
  return Math.min(Math.max(retryAt - Date.now(), fallbackMs), 10_000);
}

export function createHttpClient(config: HttpClientConfig) {
  const cache = new Map<string, CacheEntry>();
  const inFlight = new Map<string, Promise<unknown>>();
  const timeoutMs = config.timeoutMs ?? 30_000;
  const maxAttempts = Math.max(1, config.retries ?? 3);
  const retryDelayMs = config.retryDelayMs ?? 1_000;
  const cacheTtlMs = config.cacheTtlMs ?? 5 * 60_000;
  const maxConcurrentRequests = Math.max(1, config.maxConcurrentRequests ?? 4);
  const requestQueue: Array<() => void> = [];
  let activeRequests = 0;

  async function withRequestSlot<T>(task: () => Promise<T>): Promise<T> {
    if (activeRequests >= maxConcurrentRequests) {
      await new Promise<void>(resolve => requestQueue.push(resolve));
    }

    activeRequests += 1;
    try {
      return await task();
    } finally {
      activeRequests -= 1;
      requestQueue.shift()?.();
    }
  }

  async function performRequest<T>(
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
    let nextRetryDelayMs: number | null = null;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (attempt > 0) {
        await delay(nextRetryDelayMs ?? retryDelayMs * 2 ** (attempt - 1));
        nextRetryDelayMs = null;
      }

      trackApiRequestStart();
      try {
        const response = await withRequestSlot(() =>
          fetch(`${config.baseUrl}${path}`, {
            ...fetchOptions,
            method,
            headers,
            credentials: options.credentials ?? 'include',
            cache: options.cache ?? 'no-store',
            signal: requestSignal(signal, timeoutMs),
          })
        );
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
            (response.status === 429 || response.status >= 500) &&
            attempt < maxAttempts - 1
          ) {
            lastError = error;
            nextRetryDelayMs = retryDelayFromResponse(
              response,
              retryDelayMs * 2 ** attempt
            );
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
          if (isHttpError(error)) {
            notifyServiceUnavailable(error);
            throw error;
          }
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

  function request<T>(
    path: string,
    options: HttpRequestOptions = {}
  ): Promise<T> {
    const method = (options.method || 'GET').toUpperCase();
    const isIdempotent = method === 'GET' || method === 'HEAD';

    if (!isIdempotent) return performRequest<T>(path, options);

    const requestKey = `${method}:${path}`;
    const existing = inFlight.get(requestKey);
    if (existing) return existing as Promise<T>;

    const pending = performRequest<T>(path, options).finally(() => {
      if (inFlight.get(requestKey) === pending) inFlight.delete(requestKey);
    });

    inFlight.set(requestKey, pending);
    return pending;
  }

  return {
    request,
    clearCache: () => {
      cache.clear();
      inFlight.clear();
    },
  };
}
