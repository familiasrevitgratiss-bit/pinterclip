'use client';

import React, { useState } from 'react';
import { Video, Music, Volume2, ArrowUp, MessageSquare, RotateCcw, Play, Sparkles, Image as ImageIcon, Film } from 'lucide-react';
import { Translation } from '@/lib/dictionary';
import { ExtractResult, VideoFormat } from '@/app/api/extract/route';

interface ResultCardProps {
  data: ExtractResult;
  dict: Translation;
  onSelectFormat: (format: VideoFormat) => void;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  data,
  dict,
  onSelectFormat,
  onReset,
}) => {
  const isImage = data.mediaType === 'image';
  const isGif = data.mediaType === 'gif';
  const isMp3 = data.mediaType === 'mp3';
  const isVideo = !isImage && !isGif && !isMp3;

  // Selected format index / key
  const [selectedFormatIndex, setSelectedFormatIndex] = useState<number>(0);
  const [videoTab, setVideoTab] = useState<'1080p' | '720p' | '480p' | 'mp3'>('1080p');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Video Formats
  const format1080 = data.formats.find((f) => f.resolution === '1080p') || {
    quality: 'Full HD 1080p',
    resolution: '1080p',
    url: data.directUrl || data.canonicalUrl || '#',
    hasAudio: true,
    sizeMb: '18.4 MB',
    type: 'video' as const,
  };

  const format720 = data.formats.find((f) => f.resolution === '720p') || {
    quality: 'HD 720p',
    resolution: '720p',
    url: data.directUrl || data.canonicalUrl || '#',
    hasAudio: true,
    sizeMb: '9.2 MB',
    type: 'video' as const,
  };

  const format480 = data.formats.find((f) => f.resolution === '480p') || {
    quality: 'SD 480p',
    resolution: '480p',
    url: data.directUrl || data.canonicalUrl || '#',
    hasAudio: true,
    sizeMb: '4.8 MB',
    type: 'video' as const,
  };

  const formatMp3 = data.formats.find((f) => f.quality?.includes('MP3')) || {
    quality: 'Audio MP3',
    resolution: '320kbps',
    url: data.directUrl || data.canonicalUrl || '#',
    hasAudio: true,
    sizeMb: '2.4 MB',
    type: 'mp3' as const,
  };

  // Determine currently selected format
  let currentSelectedFormat: VideoFormat;
  if (isImage || isGif || isMp3) {
    currentSelectedFormat = data.formats[selectedFormatIndex] || data.formats[0];
  } else {
    currentSelectedFormat =
      videoTab === '1080p'
        ? format1080
        : videoTab === '720p'
        ? format720
        : videoTab === '480p'
        ? format480
        : formatMp3;
  }

  const previewVideoUrl = data.directUrl?.includes('.mp4') ? data.directUrl : undefined;

  return (
    <div className="w-full max-w-md mx-auto bg-[#12161d] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
      
      {/* 1. Visual Preview */}
      <div className="relative w-full aspect-video sm:aspect-[4/3] max-h-[300px] bg-black overflow-hidden group">
        {isVideo && isPlayingPreview && previewVideoUrl ? (
          <video
            src={previewVideoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.thumbnail}
              alt={data.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Play Button for Video */}
            {isVideo && previewVideoUrl && (
              <button
                onClick={() => setIsPlayingPreview(true)}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-[#e60023] text-white backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl transition hover:scale-110"
                title="Play preview"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
            )}
          </>
        )}

        {/* Media Badge Top Left */}
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#e60023] text-white rounded font-black text-[10px] tracking-wider uppercase shadow-md pointer-events-none flex items-center gap-1">
          {isImage ? (
            <>
              <ImageIcon className="w-3 h-3" />
              <span>{dict.imageBadge}</span>
            </>
          ) : isGif ? (
            <>
              <Film className="w-3 h-3" />
              <span>{dict.gifBadge}</span>
            </>
          ) : isMp3 ? (
            <>
              <Music className="w-3 h-3" />
              <span>MP3</span>
            </>
          ) : (
            <span>{dict.videoBadge}</span>
          )}
        </div>

        {/* Resolution Badge Bottom Left */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/75 backdrop-blur-sm text-slate-200 rounded text-[11px] font-mono font-bold pointer-events-none">
          {isImage
            ? dict.imageResolution
            : isGif
            ? 'GIF ANIMADO'
            : isMp3
            ? '320 KBPS'
            : videoTab === '1080p'
            ? '1080p Full HD'
            : videoTab === '720p'
            ? '720p HD'
            : 'SD 480p'}
        </div>

        {/* Duration Badge Bottom Right */}
        {isVideo && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/75 backdrop-blur-sm text-slate-200 rounded text-[11px] font-mono font-bold flex items-center gap-1 pointer-events-none">
            <span>⏱</span>
            <span>00:{data.durationSeconds ? String(data.durationSeconds).padStart(2, '0') : '30'}</span>
          </div>
        )}
      </div>

      {/* 2. Metadata */}
      <div className="px-5 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[10px] font-black uppercase tracking-wider">
            {dict.foundBadge}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {data.author ? `@${data.author.replace(/^@/, '')}` : 'Pinterest Pin'}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
          {data.title || 'Pinterest Media'}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {isVideo && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              <Volume2 className="w-3.5 h-3.5" />
              <span>{dict.withAudio}</span>
            </span>
          )}

          {isImage && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{dict.imageBadge}</span>
            </span>
          )}

          {isGif && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
              <Film className="w-3.5 h-3.5" />
              <span>{dict.gifBadge}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full">
            <ArrowUp className="w-3.5 h-3.5 text-red-500" />
            <span>Pin HD</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>Direct</span>
          </span>
        </div>
      </div>

      {/* 3. Format Selection Tabs */}
      <div className="px-5 pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {dict.chooseResolution}
          </span>
          {((isVideo && videoTab === '1080p') || (isImage && selectedFormatIndex === 0)) && (
            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {dict.bestQuality}
            </span>
          )}
        </div>

        {/* Tabs for IMAGES */}
        {isImage && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0a0d12] border border-slate-800 rounded-xl text-xs font-bold">
            {data.formats.map((fmt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFormatIndex(idx)}
                className={`py-2 px-2 rounded-lg flex flex-col items-center justify-center transition ${
                  selectedFormatIndex === idx
                    ? 'bg-[#e60023] text-white shadow-lg shadow-[#e60023]/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{fmt.resolution === 'Original' ? 'Original Ultra HD' : 'Standard JPG'}</span>
                <span className="text-[8px] opacity-75 mt-0.5">{fmt.sizeMb || 'HD'}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tabs for GIFS */}
        {isGif && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0a0d12] border border-slate-800 rounded-xl text-xs font-bold">
            {data.formats.map((fmt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFormatIndex(idx)}
                className={`py-2 px-2 rounded-lg flex flex-col items-center justify-center transition ${
                  selectedFormatIndex === idx
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{fmt.resolution === 'GIF' ? 'GIF (.gif)' : 'MP4 Video'}</span>
                <span className="text-[8px] opacity-75 mt-0.5">{fmt.sizeMb || 'HD'}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tabs for MP3 */}
        {isMp3 && (
          <div className="grid grid-cols-1 p-1 bg-[#0a0d12] border border-slate-800 rounded-xl text-xs font-bold">
            <button className="py-2.5 px-3 rounded-lg bg-amber-600 text-white flex items-center justify-center gap-2">
              <Music className="w-4 h-4" />
              <span>Audio MP3 (320kbps)</span>
            </button>
          </div>
        )}

        {/* Tabs for VIDEO */}
        {isVideo && (
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#0a0d12] border border-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => setVideoTab('1080p')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition ${
                videoTab === '1080p'
                  ? 'bg-[#e60023] text-white shadow-lg shadow-[#e60023]/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>1080p HD</span>
              <span
                className={`text-[8px] font-black px-1 rounded mt-0.5 ${
                  videoTab === '1080p' ? 'bg-black/30 text-white' : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {dict.tabWithAd}
              </span>
            </button>

            <button
              onClick={() => setVideoTab('720p')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition ${
                videoTab === '720p'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>720p HD</span>
              <span className="text-[8px] opacity-75 mt-0.5">{dict.tabStandard}</span>
            </button>

            <button
              onClick={() => setVideoTab('480p')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition ${
                videoTab === '480p'
                  ? 'bg-slate-700 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>480p SD</span>
              <span className="text-[8px] opacity-75 mt-0.5">{dict.tabFast}</span>
            </button>

            <button
              onClick={() => setVideoTab('mp3')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition ${
                videoTab === 'mp3'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>Audio</span>
              <span className="text-[8px] opacity-75 mt-0.5">MP3</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Action Download Button */}
      <div className="px-5 pb-5 space-y-2.5">
        <button
          onClick={() => onSelectFormat(currentSelectedFormat)}
          className={`w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base transition shadow-xl ${
            isImage
              ? 'bg-[#e60023] hover:bg-[#d0001f] text-white shadow-[#e60023]/25'
              : isGif
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25'
              : isMp3 || (isVideo && videoTab === 'mp3')
              ? 'bg-[#1a212d] hover:bg-[#222c3c] text-amber-400 border border-amber-500/40'
              : videoTab === '1080p'
              ? 'bg-gradient-to-r from-[#e60023] to-[#d0001f] hover:brightness-110 text-white shadow-[#e60023]/25'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
          }`}
        >
          {isImage ? (
            <ImageIcon className="w-5 h-5 text-white" />
          ) : isGif ? (
            <Film className="w-5 h-5 text-white" />
          ) : isMp3 || (isVideo && videoTab === 'mp3') ? (
            <Music className="w-5 h-5 text-amber-400" />
          ) : (
            <Video className="w-5 h-5 fill-current" />
          )}

          <span>
            {isImage
              ? dict.downloadImage
              : isGif
              ? currentSelectedFormat.resolution === 'GIF'
                ? dict.downloadGif
                : 'Descargar MP4'
              : isMp3 || (isVideo && videoTab === 'mp3')
              ? dict.downloadAudioOnly
              : videoTab === '1080p'
              ? dict.downloadHd
              : `${dict.downloadVideoGeneric} ${videoTab.toUpperCase()}`}
          </span>

          {isVideo && videoTab === '1080p' && (
            <span className="px-2 py-0.5 bg-black/30 border border-white/20 rounded-md text-[10px] font-mono tracking-wider">
              {dict.tabWithAd}
            </span>
          )}

          {isImage && (
            <span className="px-2 py-0.5 bg-black/20 rounded-md text-[10px] font-mono tracking-wider">
              {currentSelectedFormat.resolution === 'Original' ? 'ORIGINAL' : 'JPG'}
            </span>
          )}

          {isGif && (
            <span className="px-2 py-0.5 bg-black/20 rounded-md text-[10px] font-mono tracking-wider">
              {currentSelectedFormat.resolution}
            </span>
          )}

          {isVideo && videoTab !== '1080p' && (
            <span className="px-2 py-0.5 bg-black/20 rounded-md text-[10px] font-mono tracking-wider">
              {videoTab === 'mp3' ? 'MP3' : 'MP4'}
            </span>
          )}
        </button>

        {/* Disclaimer for ad notice */}
        {isVideo && videoTab === '1080p' && (
          <p className="text-[10px] text-slate-500 text-center">
            {dict.adNotice}
          </p>
        )}

        {/* Download Another Button */}
        <div className="pt-2 text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{dict.downloadAnother}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
