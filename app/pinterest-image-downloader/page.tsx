import { Metadata } from 'next';
import { PinterClipApp } from '@/components/PinterClipApp';

export const metadata: Metadata = {
  title: 'Pinterest Image Downloader - Save Photos in Original Ultra HD',
  description: 'Download Pinterest photos, aesthetic images, and wallpapers in original full resolution (JPG & PNG). 100% free Pinterest image saver.',
  alternates: {
    canonical: 'https://pinterclip.com/pinterest-image-downloader',
  },
};

export default function PinterestImageDownloaderPage() {
  return (
    <PinterClipApp
      mediaMode="image"
      customBadge="• PINTEREST IMAGE DOWNLOADER"
      customTitle="Pinterest Image & Photo Downloader"
      customSubtitle="Save high-resolution Pinterest photos, illustrations, and wallpapers in their uncompressed original format."
    />
  );
}
