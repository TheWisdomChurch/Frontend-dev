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

  it('honours rate-limit responses for safe reads', async () => {
    const rateLimited = new Response(
      JSON.stringify({ message: 'Too many requests' }),
      {
        status: 429,
        headers: {
          'content-type': 'application/json',
          'retry-after': '0',
        },
      }
    );
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(rateLimited)
      .mockResolvedValueOnce(jsonResponse({ data: ['ready'] }));
    vi.stubGlobal('fetch', fetchMock);
    const client = createHttpClient({
      baseUrl: 'https://api.example.test',
      retries: 2,
      retryDelayMs: 0,
    });

    await expect(client.request('/events', { unwrap: true })).resolves.toEqual([
      'ready',
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('deduplicates identical GET requests while the first is in flight', async () => {
    let resolveFetch: ((value: Response) => void) | undefined;
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Promise<Response>(resolve => {
          resolveFetch = resolve;
        })
    );
    vi.stubGlobal('fetch', fetchMock);
    const client = createHttpClient({ baseUrl: 'https://api.example.test' });

    const first = client.request('/events?page=1');
    const second = client.request('/events?page=1');

    expect(fetchMock).toHaveBeenCalledOnce();
    resolveFetch?.(jsonResponse({ data: ['event'] }));

    await expect(Promise.all([first, second])).resolves.toEqual([
      { data: ['event'] },
      { data: ['event'] },
    ]);
    expect(fetchMock).toHaveBeenCalledOnce();
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
