import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_API_UPSTREAM = 'https://api.wisdomchurchhq.org';

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
  headers.set('x-forwarded-host', req.headers.get('host') || '');
  headers.set('x-forwarded-proto', req.nextUrl.protocol.replace(':', ''));
  return headers;
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

  const method = req.method.toUpperCase();
  const body =
    method === 'GET' || method === 'HEAD' ? undefined : await req.arrayBuffer();

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(targetUrl, {
      method,
      headers: buildForwardHeaders(req),
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
