import { Metadata } from 'next';
import { PinterClipApp } from '@/components/PinterClipApp';

export const metadata: Metadata = {
  title: 'Pinterest to MP4 Converter - Download Pinterest Videos in 1080p HD',
  description: 'Convert and save Pinterest videos into MP4 format with audio in 1080p, 720p and 480p. Free online Pinterest to MP4 video downloader.',
  alternates: {
    canonical: 'https://pinterclip.com/pinterest-to-mp4',
  },
};

export default function PinterestToMp4Page() {
  return (
    <PinterClipApp
      mediaMode="video"
      customBadge="• PINTEREST TO MP4 CONVERTER"
      customTitle="Pinterest to MP4 Video Downloader"
      customSubtitle="Convert and download Pinterest pins directly to MP4 format with crystal clear audio in 1080p Full HD."
    />
  );
}
