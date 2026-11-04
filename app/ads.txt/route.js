import { ADSENSE_CLIENT } from '@/lib/seo';
export const dynamic = 'force-static';
export function GET() {
  const headers = { 'Content-Type': 'text/plain; charset=utf-8' };
  if (!ADSENSE_CLIENT) return new Response('Not configured\n', { status: 404, headers });
  return new Response(`google.com, ${ADSENSE_CLIENT.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`, { headers });
}
