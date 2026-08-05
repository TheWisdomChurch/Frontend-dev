import { afterEach, describe, expect, it, vi } from 'vitest';

import { createHttpClient, HttpError } from '@/lib/http';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('HTTP client', () => {
  it('unwraps API envelopes and applies consistent request defaults', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ data: { id: 7 } }));
    vi.stubGlobal('fetch', fetchMock);
    const client = createHttpClient({ baseUrl: 'https://api.example.test' });

    await expect(client.request('/items/7', { unwrap: true })).resolves.toEqual(
      {
        id: 7,
      }
    );
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.example.test/items/7');
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });
  });

  it('retries idempotent server failures and then succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ message: 'temporary' }, 503))
      .mockResolvedValueOnce(jsonResponse({ data: ['ready'] }));
    vi.stubGlobal('fetch', fetchMock);
    const client = createHttpClient({
      baseUrl: 'https://api.example.test',
      retries: 2,
      retryDelayMs: 0,
    });

    await expect(client.request('/status', { unwrap: true })).resolves.toEqual([
      'ready',
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('never retries non-idempotent writes', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ message: 'unavailable' }, 503));
    vi.stubGlobal('fetch', fetchMock);
    const client = createHttpClient({
      baseUrl: 'https://api.example.test',
      retries: 3,
      retryDelayMs: 0,
    });

    await expect(
      client.request('/orders', { method: 'POST', body: '{}' })
    ).rejects.toBeInstanceOf(HttpError);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('normalizes backend validation errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            message: 'Invalid form',
            errors: [{ field: 'email', message: 'Email is required' }],
          },
          422
        )
      )
    );
    const client = createHttpClient({ baseUrl: 'https://api.example.test' });

    const error = await client
      .request('/forms', { method: 'POST' })
      .catch(e => e);
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({
      statusCode: 422,
      validationErrors: [{ field: 'email', message: 'Email is required' }],
    });
  });
});
