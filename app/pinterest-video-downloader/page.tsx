import { Metadata } from 'next';
import { PinterClipApp } from '@/components/PinterClipApp';

export const metadata: Metadata = {
  title: 'Pinterest Video Downloader - Download Pinterest Pins & Reels in HD',
  description: 'Fast and free Pinterest video downloader. Save Pinterest videos, clips, and idea pins in 1080p and 720p without watermark.',
  alternates: {
    canonical: 'https://pinterclip.com/pinterest-video-downloader',
  },
};

export default function PinterestVideoDownloaderPage() {
  return (
    <PinterClipApp
      mediaMode="video"
      customBadge="• PINTEREST VIDEO DOWNLOADER"
      customTitle="Pinterest Video & Reels Downloader"
      customSubtitle="Download Pinterest videos, reels, and clips in ultra high resolution without watermark or account required."
    />
  );
}
