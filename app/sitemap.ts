import { MetadataRoute } from 'next';
import { languageList } from '@/lib/dictionary';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pinterclip.com';

  const alternateLanguages = Object.fromEntries(
    languageList.map((item) => [
      item.code,
      item.code === 'en' ? baseUrl : `${baseUrl}/${item.code}`,
    ])
  );

  const urls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: alternateLanguages,
      },
    },
    ...languageList
      .filter((item) => item.code !== 'en')
      .map((item) => ({
        url: `${baseUrl}/${item.code}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
        alternates: {
          languages: alternateLanguages,
        },
      })),
    // Specialized Pinterest Tools
    { url: `${baseUrl}/pinterest-to-mp4`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pinterest-video-downloader`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pinterest-image-downloader`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pinterest-gif-downloader`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Legal Pages
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/dmca`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  return urls;
}
