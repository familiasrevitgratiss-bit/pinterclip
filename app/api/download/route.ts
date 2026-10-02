import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

function sanitizeFilename(rawTitle?: string, fallback: string = 'pinterest_clip'): string {
  if (!rawTitle) return `${fallback}_${Date.now()}`;
  let sanitized = rawTitle
    .replace(/[\/\\?%*:|"<>]/g, '')
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[^\w\s\-\u00C0-\u017F\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');

  if (sanitized.length > 70) {
    sanitized = sanitized.slice(0, 70).replace(/_+$/, '');
  }
  return sanitized || `${fallback}_${Date.now()}`;
}

export async function POST(req: NextRequest) {
  try {
    const { url, isAudioOnly, mediaType, directUrl, title } = await req.json();

    if (!url && !directUrl) {
      return NextResponse.json({ success: false, error: 'URL requerida' }, { status: 400 });
    }

    const projectRoot = process.cwd();
    const downloadsDir = path.join(projectRoot, 'public', 'downloads');

    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const fileId = `${Date.now()}`;
    const isWin = process.platform === 'win32';
    const ffmpegPath = isWin
      ? (fs.existsSync(path.join(projectRoot, 'ffmpeg.exe')) ? path.join(projectRoot, 'ffmpeg.exe') : 'ffmpeg')
      : 'ffmpeg';

    const targetUrl = directUrl || url;

    // 1. Direct handling for IMAGES and GIFS
    const isImageOrGif =
      mediaType === 'image' ||
      mediaType === 'gif' ||
      targetUrl.endsWith('.jpg') ||
      targetUrl.endsWith('.jpeg') ||
      targetUrl.endsWith('.png') ||
      targetUrl.endsWith('.gif') ||
      targetUrl.includes('i.pinimg.com');

    if (isImageOrGif && !isAudioOnly && !targetUrl.includes('.mp4')) {
      try {
        const imgRes = await fetch(targetUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Referer': 'https://www.pinterest.com/',
          },
        });

        if (imgRes.ok) {
          const contentType = imgRes.headers.get('content-type') || '';
          let ext = 'jpg';
          if (contentType.includes('gif') || targetUrl.endsWith('.gif') || mediaType === 'gif') {
            ext = 'gif';
          } else if (contentType.includes('png') || targetUrl.endsWith('.png')) {
            ext = 'png';
          } else if (contentType.includes('webp')) {
            ext = 'webp';
          }

          const safeName = sanitizeFilename(title, mediaType === 'gif' ? 'pinterest_gif' : 'pinterclip_image');
          const filename = `${safeName}.${ext}`;
          const filePath = path.join(downloadsDir, filename);
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          fs.writeFileSync(filePath, buffer);

          return NextResponse.json({
            success: true,
            downloadUrl: `/downloads/${encodeURIComponent(filename)}`,
            filename,
          });
        }
      } catch (imgError) {
        console.error('Error descargando imagen directa de Pinterest:', imgError);
      }
    }

    // 2. Direct high-speed handling for MP4 videos
    if (targetUrl.includes('.mp4') || targetUrl.includes('v.pinimg.com')) {
      const isAudio = isAudioOnly || mediaType === 'mp3';
      const safeName = sanitizeFilename(title, isAudio ? 'pinterclip_audio' : 'pinterclip_video');
      const tempMp4Name = `temp_${fileId}.mp4`;
      const tempMp4Path = path.join(downloadsDir, tempMp4Name);

      try {
        const videoRes = await fetch(targetUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': 'https://www.pinterest.com/',
          },
        });

        if (videoRes.ok) {
          const buffer = Buffer.from(await videoRes.arrayBuffer());
          fs.writeFileSync(tempMp4Path, buffer);

          if (isAudio) {
            // Convert to MP3 with ffmpeg
            const mp3Filename = `${safeName}.mp3`;
            const mp3Path = path.join(downloadsDir, mp3Filename);

            await execFileAsync(ffmpegPath, [
              '-y',
              '-i',
              tempMp4Path,
              '-vn',
              '-c:a',
              'libmp3lame',
              '-b:a',
              '320k',
              mp3Path,
            ]);

            try {
              fs.unlinkSync(tempMp4Path);
            } catch {}

            return NextResponse.json({
              success: true,
              downloadUrl: `/downloads/${encodeURIComponent(mp3Filename)}`,
              filename: mp3Filename,
            });
          } else {
            const finalFilename = `${safeName}.mp4`;
            const finalPath = path.join(downloadsDir, finalFilename);

            if (fs.existsSync(finalPath) && tempMp4Name !== finalFilename) {
              fs.unlinkSync(finalPath);
            }
            fs.renameSync(tempMp4Path, finalPath);

            return NextResponse.json({
              success: true,
              downloadUrl: `/downloads/${encodeURIComponent(finalFilename)}`,
              filename: finalFilename,
            });
          }
        }
      } catch (videoError) {
        console.error('Error en fetch directo de video MP4, usando yt-dlp:', videoError);
      }
    }

    // 3. General Fallback with yt-dlp
    const ytDlpPath = isWin
      ? path.join(projectRoot, 'yt-dlp.exe')
      : (fs.existsSync(path.join(projectRoot, 'yt-dlp')) ? path.join(projectRoot, 'yt-dlp') : 'yt-dlp');
    const safeBaseName = sanitizeFilename(title, isAudioOnly ? 'pinterclip_audio' : 'pinterclip_video');
    const tempPrefix = `dl_${fileId}`;
    const outputTemplate = path.join(downloadsDir, `${tempPrefix}.%(ext)s`);

    const args: string[] = [];
    if (isWin && fs.existsSync(path.join(projectRoot, 'ffmpeg.exe'))) {
      args.push('--ffmpeg-location', projectRoot);
    }

    args.push(
      '--no-playlist',
      '--user-agent',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      '--referer',
      'https://www.pinterest.com/',
      '-o',
      outputTemplate
    );

    if (isAudioOnly || mediaType === 'mp3') {
      args.push('-x', '--audio-format', 'mp3');
    } else {
      args.push('-f', 'bv*+ba/b', '--merge-output-format', 'mp4');
    }

    args.push(targetUrl);

    await execFileAsync(ytDlpPath, args, { timeout: 60000 });

    const files = fs.readdirSync(downloadsDir);
    const generatedFile = files.find((f) => f.startsWith(tempPrefix));

    if (!generatedFile) {
      return NextResponse.json(
        { success: false, error: 'No se pudo generar el archivo descargable.' },
        { status: 500 }
      );
    }

    const finalExt = path.extname(generatedFile);
    const finalFilename = `${safeBaseName}${finalExt}`;
    const currentFilePath = path.join(downloadsDir, generatedFile);
    const finalFilePath = path.join(downloadsDir, finalFilename);

    try {
      if (fs.existsSync(finalFilePath) && generatedFile !== finalFilename) {
        fs.unlinkSync(finalFilePath);
      }
      fs.renameSync(currentFilePath, finalFilePath);
    } catch {}

    const chosenFile = fs.existsSync(finalFilePath) ? finalFilename : generatedFile;
    const downloadUrl = `/downloads/${encodeURIComponent(chosenFile)}`;

    return NextResponse.json({
      success: true,
      downloadUrl,
      filename: chosenFile,
    });
  } catch (error: any) {
    console.error('Error procesando descarga:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error procesando el archivo.' },
      { status: 500 }
    );
  }
}
