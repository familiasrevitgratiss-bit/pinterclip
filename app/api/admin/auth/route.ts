import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/siteConfig';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const config = getSiteConfig();

    const expectedPassword = (config as any).adminPassword || config.general?.adminPassword || 'admin';

    if (password === expectedPassword) {
      const response = NextResponse.json({ success: true, message: 'Autenticado correctamente' });
      // Set simple secure session cookie for 7 days
      response.cookies.set('pinterclip_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
  } catch (err: any) {
    console.error('AUTH POST ERROR:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Error al autenticar' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('pinterclip_admin_session');
  if (cookie?.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada' });
  response.cookies.delete('pinterclip_admin_session');
  return response;
}
