import { Metadata } from 'next';
import { PinterClipApp } from '@/components/PinterClipApp';
import { dictionaries, languageList } from '@/lib/dictionary';

export const metadata: Metadata = {
  title: "Download Pinterest Videos for Free (HD 1080p) - PinterClip",
  description: "Save Pinterest MP4 videos with sound, original photos, and GIFs in Full HD 1080p without watermark for free.",
  alternates: {
    canonical: 'https://pinterclip.com',
    languages: Object.fromEntries([
      ['x-default', 'https://pinterclip.com'],
      ...languageList.map((l) => [l.code, l.code === 'en' ? 'https://pinterclip.com' : `https://pinterclip.com/${l.code}`])
    ]),
  },
  openGraph: {
    title: "Pinterest Video Downloader & Pin Saver (HD 1080p) - PinterClip",
    description: "Download Pinterest videos with audio, original images, and GIFs in Full HD 1080p for free.",
    url: "https://pinterclip.com",
    siteName: "PinterClip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinterest Video Downloader - PinterClip",
    description: "Download Pinterest videos and photos in Full HD 1080p for free.",
  }
};

export default function HomePage() {
  const dict = dictionaries.en;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': dict.faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'PinterClip',
    'url': 'https://pinterclip.com',
    'description': dict.subtitle,
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <PinterClipApp initialLang="en" />
    </>
  );
}
