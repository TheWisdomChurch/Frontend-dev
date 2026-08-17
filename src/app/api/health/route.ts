export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(
    {
      status: 'ok',
      service: 'wisdom-frontend',
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'cache-control': 'no-store, max-age=0',
      },
    }
  );
}
