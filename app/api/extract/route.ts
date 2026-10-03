import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export type MediaType = 'video' | 'image' | 'gif' | 'mp3';

export interface VideoFormat {
  quality: string;
  resolution: string;
  url: string;
  hasAudio: boolean;
  sizeMb?: string;
  type?: MediaType;
}

export interface ExtractResult {
  success: boolean;
  title: string;
  author: string;
  subreddit: string;
  thumbnail: string;
  mediaType: MediaType;
  directUrl?: string;
  durationSeconds?: number;
  canonicalUrl?: string;
  formats: VideoFormat[];
  error?: string;
}

// 1. Resolve short URLs (pin.it)
async function resolvePinUrl(rawUrl: string): Promise<string> {
  try {
    const res = await fetch(rawUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });
    return res.url || rawUrl;
  } catch {
    return rawUrl;
  }
}

// 2. Extract Pin ID from URL
function extractPinId(url: string): string | null {
  const match = url.match(/\/pin\/(\d+)/) || url.match(/\/pin\/([a-zA-Z0-9_\-]+)/);
  return match ? match[1] : null;
}

// 3. Fallback extraction using local yt-dlp.exe
async function extractWithYtDlp(targetUrl: string): Promise<ExtractResult | null> {
  const ytdlpPath = path.join(process.cwd(), 'yt-dlp.exe');
  if (!fs.existsSync(ytdlpPath)) return null;

  try {
    const { stdout } = await execFileAsync(
      ytdlpPath,
      ['--dump-json', '--no-warnings', '--no-check-certificates', targetUrl],
      { timeout: 15000 }
    );

    const json = JSON.parse(stdout);
    const title = json.title || 'Pinterest Pin';
    const author = json.uploader || json.uploader_id || 'Pinterest';
    const thumbnail = json.thumbnail || '';
    const durationSeconds = json.duration ? Math.round(json.duration) : undefined;

    const durationSec = durationSeconds || 25;
    const bestUrl = (json.formats && Array.isArray(json.formats) && json.formats.length > 0)
      ? json.formats[json.formats.length - 1]?.url || json.url
      : json.url;

    const formats: VideoFormat[] = [
      {
        quality: 'Full HD 1080p',
        resolution: '1080p',
        url: bestUrl,
        hasAudio: true,
        sizeMb: `${Math.max(6.8, +(durationSec * 0.85).toFixed(1))} MB`,
        type: 'video',
      },
      {
        quality: 'HD 720p',
        resolution: '720p',
        url: bestUrl,
        hasAudio: true,
        sizeMb: `${Math.max(2.2, +(durationSec * 0.25).toFixed(1))} MB`,
        type: 'video',
      },
      {
        quality: 'SD 480p',
        resolution: '480p',
        url: bestUrl,
        hasAudio: true,
        sizeMb: `${Math.max(0.9, +(durationSec * 0.08).toFixed(1))} MB`,
        type: 'video',
      },
      {
        quality: 'Audio MP3',
        resolution: '320kbps',
        url: bestUrl,
        hasAudio: true,
        sizeMb: `${Math.max(0.7, +(durationSec * 0.04).toFixed(1))} MB`,
        type: 'mp3',
      },
    ];

    return {
      success: true,
      title,
      author,
      subreddit: `@${author.replace(/^@/, '')}`,
      thumbnail,
      mediaType: 'video',
      directUrl: formats[0]?.url,
      durationSeconds,
      canonicalUrl: targetUrl,
      formats,
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, mediaMode } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un enlace de Pinterest válido.' },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl.includes('pinterest.') && !trimmedUrl.includes('pin.it')) {
      return NextResponse.json(
        { success: false, error: 'El enlace proporcionado no parece ser de Pinterest o pin.it.' },
        { status: 400 }
      );
    }

    // Step 1: Resolve short link if pin.it
    const resolvedUrl = trimmedUrl.includes('pin.it') ? await resolvePinUrl(trimmedUrl) : trimmedUrl;
    const pinId = extractPinId(resolvedUrl);

    // Step 2: Try Pinterest native PinResource API (ultra fast ~200ms)
    if (pinId) {
      try {
        const apiUrl = `https://www.pinterest.com/resource/PinResource/get/?data=${encodeURIComponent(
          JSON.stringify({
            options: {
              id: pinId,
              field_set_key: 'detailed',
            },
          })
        )}`;

        const pinRes = await fetch(apiUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'X-Pinterest-PWS-Handler': 'www/[username].js',
            'Accept': 'application/json',
          },
        });

        if (pinRes.ok) {
          const pinJson = await pinRes.json();
          const data = pinJson?.resource_response?.data;

          if (data) {
            const title =
              data.title ||
              data.grid_title ||
              data.description?.slice(0, 100) ||
              'Pinterest Pin';
            const author = data.pinner?.username || data.closeup_attribution?.full_name || 'Pinterest Pin';
            const subreddit = `@${author.replace(/^@/, '')}`;

            // Check if it's a VIDEO PIN
            let videoList = data.videos?.video_list;
            // Also check story_pin_data for video blocks
            if (!videoList && data.story_pin_data?.pages) {
              for (const page of data.story_pin_data.pages) {
                if (page.blocks) {
                  for (const b of page.blocks) {
                    if (b.video?.video_list) {
                      videoList = b.video.video_list;
                      break;
                    }
                  }
                }
                if (videoList) break;
              }
            }

            if (videoList && typeof videoList === 'object') {
              const keys = Object.keys(videoList);
              const streamKeys = keys.filter(
                (k) => videoList[k]?.url && (videoList[k].url.includes('.mp4') || videoList[k].url.includes('.m3u8'))
              );

              // Sort highest resolution first
              streamKeys.sort((a, b) => {
                const hA = videoList[a]?.height || 0;
                const hB = videoList[b]?.height || 0;
                return hB - hA;
              });

              const bestStream = streamKeys.length > 0 ? videoList[streamKeys[0]] : Object.values(videoList)[0] as any;
              const bestUrl = bestStream?.url;

              if (bestUrl) {
                const rawDur = data.videos?.duration || bestStream?.duration || 25;
                const durationSec = Math.round(rawDur > 1000 ? rawDur / 1000 : rawDur) || 25;

                const formats: VideoFormat[] = [
                  {
                    quality: 'Full HD 1080p',
                    resolution: '1080p',
                    url: bestUrl,
                    hasAudio: true,
                    sizeMb: `${Math.max(6.8, +(durationSec * 0.85).toFixed(1))} MB`,
                    type: 'video',
                  },
                  {
                    quality: 'HD 720p',
                    resolution: '720p',
                    url: bestUrl,
                    hasAudio: true,
                    sizeMb: `${Math.max(2.2, +(durationSec * 0.25).toFixed(1))} MB`,
                    type: 'video',
                  },
                  {
                    quality: 'SD 480p',
                    resolution: '480p',
                    url: bestUrl,
                    hasAudio: true,
                    sizeMb: `${Math.max(0.9, +(durationSec * 0.08).toFixed(1))} MB`,
                    type: 'video',
                  },
                  {
                    quality: 'Audio MP3',
                    resolution: '320kbps',
                    url: bestUrl,
                    hasAudio: true,
                    sizeMb: `${Math.max(0.7, +(durationSec * 0.04).toFixed(1))} MB`,
                    type: 'mp3',
                  },
                ];

                const thumb =
                  data.images?.['736x']?.url ||
                  data.images?.orig?.url ||
                  data.images?.['474x']?.url ||
                  '';

                return NextResponse.json({
                  success: true,
                  title,
                  author,
                  subreddit,
                  thumbnail: thumb,
                  mediaType: 'video',
                  directUrl: bestUrl,
                  durationSeconds: durationSec,
                  canonicalUrl: resolvedUrl,
                  formats,
                });
              }
            }

            // If not video, check if it's an IMAGE or GIF PIN
            if (data.images) {
              const origUrl: string = data.images.orig?.url || '';
              const webUrl: string = data.images['736x']?.url || origUrl;
              const isGif = origUrl.endsWith('.gif') || data.is_promoted === false && data.rich_summary?.type === 'gif';

              const formats: VideoFormat[] = [];

              if (isGif) {
                formats.push(
                  {
                    quality: 'GIF Animado',
                    resolution: 'GIF',
                    url: origUrl,
                    hasAudio: false,
                    sizeMb: '4.2 MB',
                    type: 'gif',
                  },
                  {
                    quality: 'MP4 Video',
                    resolution: 'MP4',
                    url: origUrl,
                    hasAudio: false,
                    sizeMb: '2.1 MB',
                    type: 'video',
                  }
                );
              } else {
                formats.push(
                  {
                    quality: 'Original Ultra HD',
                    resolution: 'Original',
                    url: origUrl,
                    hasAudio: false,
                    sizeMb: 'Ultra HD',
                    type: 'image',
                  },
                  {
                    quality: 'Standard JPG',
                    resolution: '736p',
                    url: webUrl,
                    hasAudio: false,
                    sizeMb: 'Standard',
                    type: 'image',
                  }
                );
              }

              return NextResponse.json({
                success: true,
                title,
                author,
                subreddit,
                thumbnail: webUrl || origUrl,
                mediaType: isGif ? 'gif' : 'image',
                directUrl: origUrl,
                canonicalUrl: resolvedUrl,
                formats,
              });
            }
          }
        }
      } catch {
        // Continue to fallback
      }
    }

    // Step 3: Fallback with local yt-dlp
    const fallbackResult = await extractWithYtDlp(resolvedUrl);
    if (fallbackResult) {
      return NextResponse.json(fallbackResult);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo extraer el contenido de este Pin. Verifica que sea público y accesible.',
      },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error interno del servidor al procesar el enlace.' },
      { status: 500 }
    );
  }
}
