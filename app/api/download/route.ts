import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// Global in-memory job tracker to avoid parallel duplicate downloads
const activeJobs = new Map<string, Promise<string>>();

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
    const { url, isAudioOnly, mediaType, directUrl, title, quality, resolution, preheat } = await req.json();

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

    // 2. Identify Video or Audio Tiers
    const isAudio = isAudioOnly || mediaType === 'mp3' || (quality && quality.toLowerCase().includes('mp3'));
    const qualityStr = `${quality || ''} ${resolution || ''}`.toLowerCase();
    const is1080 = !isAudio && (qualityStr.includes('1080') || qualityStr.includes('with ad'));
    const is720 = !isAudio && qualityStr.includes('720') && !is1080;
    const is480 = !isAudio && (qualityStr.includes('480') || qualityStr.includes('sd') || qualityStr.includes('fast')) && !is1080 && !is720;

    const qualitySuffix = isAudio
      ? ''
      : is1080
      ? '_1080p_FullHD'
      : is720
      ? '_720p_HD'
      : is480
      ? '_480p_SD'
      : '';

    const safeBaseName = sanitizeFilename(title, isAudio ? 'pinterclip_audio' : 'pinterclip_video');
    const finalFilename = isAudio ? `${safeBaseName}.mp3` : `${safeBaseName}${qualitySuffix}.mp4`;
    const finalPath = path.join(downloadsDir, finalFilename);

    // Return cached file if already generated and valid (INSTANT: 0.005s)
    if (fs.existsSync(finalPath) && fs.statSync(finalPath).size > 1000) {
      return NextResponse.json({
        success: true,
        downloadUrl: `/downloads/${encodeURIComponent(finalFilename)}`,
        filename: finalFilename,
      });
    }

    // If preheat request and already working or done, return early
    if (preheat && activeJobs.has(finalFilename)) {
      return NextResponse.json({ success: true, preheating: true });
    }

    // Worker function to generate file
    const processJob = async (): Promise<string> => {
      const tempSourcePath = path.join(downloadsDir, `temp_src_${fileId}.mp4`);
      let sourceAcquired = false;

      // Check if targetUrl is a direct MP4 (not HLS m3u8)
      if (targetUrl.includes('.mp4') && !targetUrl.includes('.m3u8')) {
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
            fs.writeFileSync(tempSourcePath, buffer);
            sourceAcquired = true;
          }
        } catch (directErr) {
          console.error('Fetch directo MP4 falló, continuando a yt-dlp:', directErr);
        }
      }

      // If direct MP4 fetch didn't acquire source (or if it's an .m3u8 playlist), use yt-dlp with parallel fragments
      if (!sourceAcquired) {
        const ytDlpPath = isWin
          ? path.join(projectRoot, 'yt-dlp.exe')
          : (fs.existsSync(path.join(projectRoot, 'yt-dlp')) ? path.join(projectRoot, 'yt-dlp') : 'yt-dlp');

        const tempPrefix = `dl_src_${fileId}`;
        const outputTemplate = path.join(downloadsDir, `${tempPrefix}.%(ext)s`);

        const ytdlpArgs: string[] = [];
        if (isWin && fs.existsSync(path.join(projectRoot, 'ffmpeg.exe'))) {
          ytdlpArgs.push('--ffmpeg-location', projectRoot);
        }

        ytdlpArgs.push(
          '--no-playlist',
          '--concurrent-fragments', '5',
          '--no-cache-dir',
          '--no-check-certificates',
          '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          '--referer', 'https://www.pinterest.com/',
          '-o', outputTemplate
        );

        if (isAudio) {
          ytdlpArgs.push('-x', '--audio-format', 'mp3');
        } else {
          ytdlpArgs.push('-f', 'bv*+ba/b', '--merge-output-format', 'mp4');
        }

        ytdlpArgs.push(targetUrl);

        await execFileAsync(ytDlpPath, ytdlpArgs, { timeout: 60000 });

        const files = fs.readdirSync(downloadsDir);
        const generatedFile = files.find((f) => f.startsWith(tempPrefix));

        if (generatedFile) {
          const genPath = path.join(downloadsDir, generatedFile);
          if (isAudio && generatedFile.endsWith('.mp3')) {
            fs.renameSync(genPath, finalPath);
            return finalFilename;
          } else {
            fs.renameSync(genPath, tempSourcePath);
            sourceAcquired = true;
          }
        }
      }

      if (!fs.existsSync(tempSourcePath)) {
        throw new Error('No se pudo descargar el stream del video.');
      }

      // Step B: Ultra-fast processing according to requested quality tier
      try {
        if (isAudio) {
          await execFileAsync(ffmpegPath, [
            '-y',
            '-i', tempSourcePath,
            '-vn',
            '-c:a', 'libmp3lame',
            '-b:a', '320k',
            finalPath,
          ]);
        } else if (is480) {
          // 480p SD: Ultrafast downscale to 360p with low bitrate & muffled audio
          await execFileAsync(ffmpegPath, [
            '-y',
            '-i', tempSourcePath,
            '-vf', 'scale=-2:360',
            '-c:v', 'libx264',
            '-crf', '38',
            '-b:v', '220k',
            '-maxrate', '280k',
            '-bufsize', '450k',
            '-preset', 'ultrafast',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-b:a', '64k',
            finalPath,
          ]);
        } else if (is720) {
          // 720p HD: Ultrafast downscale to 640p medium bitrate
          await execFileAsync(ffmpegPath, [
            '-y',
            '-i', tempSourcePath,
            '-vf', 'scale=-2:640',
            '-c:v', 'libx264',
            '-crf', '31',
            '-b:v', '600k',
            '-maxrate', '750k',
            '-bufsize', '1100k',
            '-preset', 'ultrafast',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-b:a', '96k',
            finalPath,
          ]);
        } else {
          // 1080p Full HD: Instant stream copy of original master source (lossless & instant ~0.02s)
          try {
            await execFileAsync(ffmpegPath, [
              '-y',
              '-i', tempSourcePath,
              '-c', 'copy',
              finalPath,
            ]);
          } catch {
            await execFileAsync(ffmpegPath, [
              '-y',
              '-i', tempSourcePath,
              '-c:v', 'libx264',
              '-crf', '16',
              '-preset', 'ultrafast',
              '-pix_fmt', 'yuv420p',
              '-c:a', 'aac',
              '-b:a', '256k',
              finalPath,
            ]);
          }
        }
      } catch (ffmpegErr) {
        console.error('Error FFmpeg, utilizando archivo fuente:', ffmpegErr);
        if (!fs.existsSync(finalPath) && fs.existsSync(tempSourcePath)) {
          fs.renameSync(tempSourcePath, finalPath);
        }
      }

      // Cleanup
      try {
        if (fs.existsSync(tempSourcePath) && tempSourcePath !== finalPath) {
          fs.unlinkSync(tempSourcePath);
        }
      } catch {}

      return finalFilename;
    };

    // If already in flight, await existing job
    let jobPromise = activeJobs.get(finalFilename);
    if (!jobPromise) {
      jobPromise = processJob().finally(() => {
        activeJobs.delete(finalFilename);
      });
      activeJobs.set(finalFilename, jobPromise);
    }

    if (preheat) {
      // Preheat returns immediately while job completes in background
      return NextResponse.json({ success: true, preheating: true });
    }

    const generatedFilename = await jobPromise;

    return NextResponse.json({
      success: true,
      downloadUrl: `/downloads/${encodeURIComponent(generatedFilename)}`,
      filename: generatedFilename,
    });
  } catch (error: any) {
    console.error('Error procesando descarga:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error procesando el archivo.' },
      { status: 500 }
    );
  }
}
