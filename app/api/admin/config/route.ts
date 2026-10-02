import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig, SiteConfig } from '@/lib/siteConfig';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('pinterclip_admin_session');
  if (cookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const config = getSiteConfig();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get('pinterclip_admin_session');
  if (cookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body: Partial<SiteConfig> = await req.json();
    const ok = saveSiteConfig(body);

    if (ok) {
      return NextResponse.json({ success: true, message: 'Configuración guardada exitosamente' });
    } else {
      return NextResponse.json({ success: false, error: 'No se pudo guardar la configuración' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Datos inválidos' }, { status: 400 });
  }
}
