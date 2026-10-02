import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = getSiteConfig();
  return NextResponse.json({
    rewardedAdCooldownSeconds: config.monetization?.rewardedAdCooldownSeconds ?? 5,
    adsensePublisherId: config.monetization?.adsensePublisherId || '',
    slots: config.monetization?.slots || {},
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    }
  });
}
