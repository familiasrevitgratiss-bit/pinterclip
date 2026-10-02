import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';
import { getSiteConfig } from '@/lib/siteConfig';

const execAsync = util.promisify(exec);

function isAuthorized(request: NextRequest): boolean {
  const session = request.cookies.get('pinterclip_admin_session');
  return session?.value === 'authenticated';
}

function getDownloadsStats() {
  const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    return { count: 0, sizeMb: 0 };
  }

  try {
    const files = fs.readdirSync(downloadsDir);
    let totalBytes = 0;
    let fileCount = 0;

    for (const file of files) {
      if (file === '.gitkeep') continue;
      const filePath = path.join(downloadsDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          totalBytes += stat.size;
          fileCount++;
        }
      } catch {
        // ignore errors reading individual files
      }
    }

    return {
      count: fileCount,
      sizeMb: parseFloat((totalBytes / (1024 * 1024)).toFixed(2)),
    };
  } catch {
    return { count: 0, sizeMb: 0 };
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Get yt-dlp version
  let ytdlpVersion = 'Desconocido';
  const isWin = process.platform === 'win32';
  const ytDlpBinary = isWin
    ? path.join(process.cwd(), 'yt-dlp.exe')
    : (fs.existsSync(path.join(process.cwd(), 'yt-dlp')) ? path.join(process.cwd(), 'yt-dlp') : 'yt-dlp');

  try {
    const { stdout } = await execAsync(`"${ytDlpBinary}" --version`);
    ytdlpVersion = stdout.trim();
  } catch (err: any) {
    ytdlpVersion = 'Error al consultar (' + (err.message || 'desconocido') + ')';
  }

  // Get git info
  let gitBranch = 'N/A';
  let gitLastCommit = 'N/A';
  let gitStatusText = 'N/A';
  const mingit = path.join(process.cwd(), '..', 'mingit', 'cmd', 'git.exe');
  const gitCmd = fs.existsSync(mingit) ? `"${mingit}"` : 'git';

  try {
    const branchRes = await execAsync(`${gitCmd} rev-parse --abbrev-ref HEAD`);
    gitBranch = branchRes.stdout.trim();

    const commitRes = await execAsync(`${gitCmd} log -1 --pretty=format:"%h - %s (%cr)"`);
    gitLastCommit = commitRes.stdout.trim();

    const statusRes = await execAsync(`${gitCmd} status --porcelain`);
    const dirtyFiles = statusRes.stdout.trim().split('\n').filter(Boolean);
    gitStatusText = dirtyFiles.length === 0 ? 'Repositorio limpio (sin cambios pendientes)' : `${dirtyFiles.length} archivo(s) modificados sin commit`;
  } catch {
    // Git might not be in a git repo or git not in PATH
  }

  const downloads = getDownloadsStats();

  return NextResponse.json({
    ytdlpVersion,
    downloads,
    git: {
      branch: gitBranch,
      lastCommit: gitLastCommit,
      status: gitStatusText,
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { action } = await request.json();

    if (action === 'update-ytdlp') {
      const isWin = process.platform === 'win32';
      const ytDlpBinary = isWin
        ? path.join(process.cwd(), 'yt-dlp.exe')
        : (fs.existsSync(path.join(process.cwd(), 'yt-dlp')) ? path.join(process.cwd(), 'yt-dlp') : 'yt-dlp');

      try {
        const { stdout, stderr } = await execAsync(`"${ytDlpBinary}" -U`);
        const output = stdout.trim() || stderr.trim();
        return NextResponse.json({ success: true, message: output || 'yt-dlp actualizado con éxito' });
      } catch (err: any) {
        return NextResponse.json({ success: false, message: `Error al actualizar: ${err.message}` }, { status: 500 });
      }
    }

    if (action === 'clean-downloads') {
      const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
      if (fs.existsSync(downloadsDir)) {
        const files = fs.readdirSync(downloadsDir);
        let deletedCount = 0;
        for (const file of files) {
          if (file === '.gitkeep') continue;
          try {
            fs.unlinkSync(path.join(downloadsDir, file));
            deletedCount++;
          } catch {
            // ignore
          }
        }
        return NextResponse.json({ success: true, message: `Se liberó espacio eliminando ${deletedCount} archivos temporales.` });
      }
      return NextResponse.json({ success: true, message: 'No había archivos para eliminar.' });
    }

    if (action === 'purge-cloudflare') {
      const config = getSiteConfig();
      const { zoneId, apiToken } = config.cloudflare;

      if (!zoneId || !apiToken) {
        return NextResponse.json({ success: false, message: 'Faltan Zone ID o API Token en la configuración de Cloudflare.' }, { status: 400 });
      }

      try {
        const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ purge_everything: true }),
        });

        const data = await res.json();
        if (data.success) {
          return NextResponse.json({ success: true, message: 'Caché de Cloudflare purgada exitosamente en todo el CDN global.' });
        } else {
          const errDetail = data.errors?.[0]?.message || 'Error desconocido de Cloudflare';
          return NextResponse.json({ success: false, message: `Cloudflare API error: ${errDetail}` }, { status: 400 });
        }
      } catch (err: any) {
        return NextResponse.json({ success: false, message: `Error de red con Cloudflare: ${err.message}` }, { status: 500 });
      }
    }

    if (action === 'trigger-deploy') {
      const config = getSiteConfig();
      const webhookUrl = config.github?.deployWebhookUrl;

      if (!webhookUrl) {
        return NextResponse.json({ success: false, message: 'No hay URL de Webhook de Despliegue configurada.' }, { status: 400 });
      }

      try {
        const res = await fetch(webhookUrl, { method: 'POST' });
        if (res.ok) {
          return NextResponse.json({ success: true, message: 'Señal de despliegue enviada con éxito al servidor/hosting.' });
        } else {
          return NextResponse.json({ success: false, message: `Webhook respondió con código de estado HTTP ${res.status}` }, { status: 400 });
        }
      } catch (err: any) {
        return NextResponse.json({ success: false, message: `Error al llamar al webhook: ${err.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en servidor' }, { status: 500 });
  }
}
