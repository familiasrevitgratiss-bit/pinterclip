import { Metadata } from 'next';
import { PinterClipApp } from '@/components/PinterClipApp';

export const metadata: Metadata = {
  title: 'Pinterest GIF Downloader - Download Animated GIFs & Loops',
  description: 'Download animated Pinterest GIFs and short video loops in high quality. Save Pinterest GIFs as animated GIF or MP4.',
  alternates: {
    canonical: 'https://pinterclip.com/pinterest-gif-downloader',
  },
};

export default function PinterestGifDownloaderPage() {
  return (
    <PinterClipApp
      mediaMode="gif"
      customBadge="• PINTEREST GIF DOWNLOADER"
      customTitle="Pinterest Animated GIF Downloader"
      customSubtitle="Save animated Pinterest GIFs and looping animations directly to your device as high quality GIF or MP4 files."
    />
  );
}
