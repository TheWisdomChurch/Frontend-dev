import { NextRequest } from 'next/server';
import { createHash, createHmac, randomUUID } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_API_UPSTREAM = 'https://api.wisdomchurchhq.org';
const API_BASE_PATH = '/api/v1';
const SIGNING_HEADER_PREFIX = 'x-wc-proxy';

type ProxySigning = {
  keyId: string;
  secret: string;
};

type RouteParams = {
  path?: string[];
};

type RouteContext = {
  params: RouteParams | Promise<RouteParams>;
};

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

const REQUEST_HEADERS_TO_DROP = new Set([
  ...HOP_BY_HOP_HEADERS,
  'accept-encoding',
]);

const RESPONSE_HEADERS_TO_DROP = new Set([
  ...HOP_BY_HOP_HEADERS,
  'content-encoding',
  'content-length',
]);

function jsonResponse(payload: unknown, status = 500): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function normalizeUpstream(raw?: string): string {
  const value = (raw || '').trim().replace(/\/+$/, '');

  if (!value) return '';

  return value.endsWith(API_BASE_PATH)
    ? value.slice(0, -API_BASE_PATH.length)
    : value;
}

function resolveUpstreamOrigin(): string {
  return normalizeUpstream(
    process.env.API_PROXY_TARGET ||
      process.env.API_PROXY_ORIGIN ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.BACKEND_URL ||
      DEFAULT_API_UPSTREAM
  );
}

function resolveProxySigning(): ProxySigning | null {
  const secret = process.env.API_PROXY_SIGNING_SECRET?.trim();

  if (!secret) return null;

  return {
    keyId: (process.env.API_PROXY_SIGNING_KEY_ID || 'frontend-proxy-v1')
      .trim()
      .toLowerCase(),
    secret,
  };
}

function toBuffer(input: ArrayBuffer | Uint8Array | string): Buffer {
  if (typeof input === 'string') return Buffer.from(input, 'utf8');
  if (input instanceof ArrayBuffer) return Buffer.from(new Uint8Array(input));

  return Buffer.from(input.buffer, input.byteOffset, input.byteLength);
}

function sha256Hex(input: ArrayBuffer | Uint8Array | string): string {
  return createHash('sha256').update(toBuffer(input)).digest('hex');
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    ''
  );
}

function buildForwardHeaders(req: NextRequest): Headers {
  const headers = new Headers();

  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();

    if (REQUEST_HEADERS_TO_DROP.has(lower)) return;
    if (lower.startsWith(`${SIGNING_HEADER_PREFIX}-`)) return;

    headers.set(key, value);
  });

  const host = req.headers.get('host') || '';
  const proto = req.nextUrl.protocol.replace(':', '') || 'https';
  const clientIp = getClientIp(req);
  const forwardedFor = req.headers.get('x-forwarded-for');

  headers.set('x-forwarded-host', host);
  headers.set('x-forwarded-proto', proto);
  headers.set('x-proxy-source', 'wisdom-frontend');

  if (clientIp) {
    headers.set(
      'x-forwarded-for',
      forwardedFor ? `${forwardedFor}, ${clientIp}` : clientIp
    );
  }

  return headers;
}

function attachSignatureHeaders(params: {
  headers: Headers;
  signing: ProxySigning | null;
  method: string;
  pathWithQuery: string;
  body?: ArrayBuffer;
}): void {
  const { headers, signing, method, pathWithQuery, body } = params;

  if (!signing) return;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomUUID();
  const bodyHash = sha256Hex(body ?? '');

  const payload = [
    method.toUpperCase(),
    pathWithQuery,
    timestamp,
    nonce,
    bodyHash,
  ].join('\n');

  const signature = createHmac('sha256', signing.secret)
    .update(payload, 'utf8')
    .digest('hex');

  headers.set(`${SIGNING_HEADER_PREFIX}-key-id`, signing.keyId);
  headers.set(`${SIGNING_HEADER_PREFIX}-timestamp`, timestamp);
  headers.set(`${SIGNING_HEADER_PREFIX}-nonce`, nonce);
  headers.set(`${SIGNING_HEADER_PREFIX}-body-sha256`, bodyHash);
  headers.set(`${SIGNING_HEADER_PREFIX}-signature`, signature);
}

function filterResponseHeaders(source: Headers): Headers {
  const headers = new Headers();

  source.forEach((value, key) => {
    if (!RESPONSE_HEADERS_TO_DROP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  headers.set('cache-control', 'no-store');

  return headers;
}

function buildTargetUrl(req: NextRequest, path: string[]) {
  const upstream = resolveUpstreamOrigin();

  if (!upstream) {
    throw new Error(
      'API upstream is not configured. Set API_PROXY_ORIGIN or API_PROXY_TARGET.'
    );
  }

  const safePath = path
    .filter(Boolean)
    .map(segment => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');

  const pathWithQuery = `${API_BASE_PATH}/${safePath}${req.nextUrl.search || ''}`;

  return {
    targetUrl: `${upstream}${pathWithQuery}`,
    pathWithQuery,
  };
}

async function readBody(req: NextRequest): Promise<ArrayBuffer | undefined> {
  const method = req.method.toUpperCase();

  if (method === 'GET' || method === 'HEAD') return undefined;

  return req.arrayBuffer();
}

async function proxyRequest(
  req: NextRequest,
  ctx: RouteContext
): Promise<Response> {
  const params = await ctx.params;
  const path = params.path ?? [];
  const method = req.method.toUpperCase();

  let targetUrl = '';
  let pathWithQuery = '';

  try {
    const built = buildTargetUrl(req, path);
    targetUrl = built.targetUrl;
    pathWithQuery = built.pathWithQuery;
  } catch (error) {
    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Invalid API proxy configuration.',
      },
      500
    );
  }

  let body: ArrayBuffer | undefined;

  try {
    body = await readBody(req);
  } catch {
    return jsonResponse({ error: 'Unable to read request body.' }, 400);
  }

  const headers = buildForwardHeaders(req);

  attachSignatureHeaders({
    headers,
    signing: resolveProxySigning(),
    method,
    pathWithQuery,
    body,
  });

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
    });

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: filterResponseHeaders(upstreamResponse.headers),
    });
  } catch (error) {
    return jsonResponse(
      {
        error: 'Failed to reach API upstream service.',
        detail: error instanceof Error ? error.message : undefined,
      },
      502
    );
  }
}

export function GET(req: NextRequest, ctx: RouteContext) {
  return proxyRequest(req, ctx);
}

export function POST(req: NextRequest, ctx: RouteContext) {
  return proxyRequest(req, ctx);
}

export function PUT(req: NextRequest, ctx: RouteContext) {
  return proxyRequest(req, ctx);
}

export function PATCH(req: NextRequest, ctx: RouteContext) {
  return proxyRequest(req, ctx);
}

export function DELETE(req: NextRequest, ctx: RouteContext) {
  return proxyRequest(req, ctx);
}

export function OPTIONS(req: NextRequest, ctx: RouteContext) {
  return proxyRequest(req, ctx);
}
