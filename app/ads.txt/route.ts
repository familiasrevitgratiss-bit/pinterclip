import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = getSiteConfig();
  const content = config.monetization?.adsTxtContent || '# PinterClip ads.txt\n# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0';
  
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
