import { NextRequest } from 'next/server';
import { createHash, createHmac, randomUUID } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_API_UPSTREAM = 'https://api.wisdomchurchhq.org';
const SIGNING_HEADER_PREFIX = 'x-wc-proxy';

type ProxySigning = {
  keyId: string;
  secret: string;
};

function normalizeUpstream(raw: string): string {
  let value = raw.trim();
  if (!value) return '';
  value = value.replace(/\/+$/, '');
  if (value.endsWith('/api/v1')) value = value.slice(0, -'/api/v1'.length);
  return value;
}

function resolveUpstreamOrigin(): string {
  const envValue =
    process.env.API_PROXY_TARGET ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    DEFAULT_API_UPSTREAM;

  return normalizeUpstream(envValue);
}

function resolveProxySigning(): ProxySigning | null {
  const secret = (process.env.API_PROXY_SIGNING_SECRET || '').trim();
  if (!secret) return null;

  const keyId = (process.env.API_PROXY_SIGNING_KEY_ID || 'frontend-proxy-v1')
    .trim()
    .toLowerCase();

  return { keyId, secret };
}

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

function buildForwardHeaders(req: NextRequest): Headers {
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) return;
    headers.set(key, value);
  });
  const host = req.headers.get('host') || '';
  const proto = req.nextUrl.protocol.replace(':', '');
  const forwardedFor = req.headers.get('x-forwarded-for');
  const remoteAddr =
    req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip');

  headers.set('x-forwarded-host', host);
  headers.set('x-forwarded-proto', proto);
  if (remoteAddr) {
    headers.set(
      'x-forwarded-for',
      forwardedFor ? `${forwardedFor}, ${remoteAddr}` : remoteAddr
    );
  }
  return headers;
}

function sha256Hex(input: ArrayBuffer | Uint8Array | string): string {
  const hash = createHash('sha256');
  hash.update(
    typeof input === 'string' ? Buffer.from(input, 'utf8') : Buffer.from(input)
  );
  return hash.digest('hex');
}

function buildSigningPayload(
  method: string,
  pathWithQuery: string,
  timestamp: string,
  nonce: string,
  bodyHash: string
): string {
  return [method, pathWithQuery, timestamp, nonce, bodyHash].join('\n');
}

function attachSignatureHeaders(params: {
  headers: Headers;
  signing: ProxySigning | null;
  method: string;
  pathWithQuery: string;
  body: ArrayBuffer | undefined;
}) {
  const { headers, signing, method, pathWithQuery, body } = params;
  if (!signing) return;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomUUID();
  const bodyHash = sha256Hex(body ?? '');
  const payload = buildSigningPayload(
    method.toUpperCase(),
    pathWithQuery,
    timestamp,
    nonce,
    bodyHash
  );
  const signature = createHmac('sha256', signing.secret)
    .update(payload, 'utf8')
    .digest('hex');

  headers.set(`${SIGNING_HEADER_PREFIX}-key-id`, signing.keyId);
  headers.set(`${SIGNING_HEADER_PREFIX}-timestamp`, timestamp);
  headers.set(`${SIGNING_HEADER_PREFIX}-nonce`, nonce);
  headers.set(`${SIGNING_HEADER_PREFIX}-body-sha256`, bodyHash);
  headers.set(`${SIGNING_HEADER_PREFIX}-signature`, signature);
}

function sanitizeRequestHeaders(headers: Headers): Headers {
  const sanitized = new Headers();
  headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower.startsWith(`${SIGNING_HEADER_PREFIX}-`)) return;
    sanitized.set(key, value);
  });
  return sanitized;
}

function filterResponseHeaders(source: Headers): Headers {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) return;
    headers.set(key, value);
  });
  return headers;
}

async function proxyRequest(req: NextRequest, path: string[]) {
  const upstream = resolveUpstreamOrigin();
  if (!upstream) {
    return new Response(
      JSON.stringify({
        error:
          'API upstream is not configured. Set API_PROXY_TARGET or NEXT_PUBLIC_BACKEND_URL.',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }

  const joinedPath = path.join('/');
  const query = req.nextUrl.search || '';
  const targetUrl = `${upstream}/api/v1/${joinedPath}${query}`;
  const pathWithQuery = `/api/v1/${joinedPath}${query}`;

  const method = req.method.toUpperCase();
  const body =
    method === 'GET' || method === 'HEAD' ? undefined : await req.arrayBuffer();
  const signing = resolveProxySigning();
  const headers = sanitizeRequestHeaders(buildForwardHeaders(req));
  attachSignatureHeaders({
    headers,
    signing,
    method,
    pathWithQuery,
    body,
  });

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: 'follow',
      cache: 'no-store',
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to reach API upstream service';
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: filterResponseHeaders(upstreamRes.headers),
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}

export async function OPTIONS(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path);
}
