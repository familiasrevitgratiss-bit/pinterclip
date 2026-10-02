import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PinterClipApp } from '@/components/PinterClipApp';
import { dictionaries, Language, languageList } from '@/lib/dictionary';

interface Props {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateStaticParams() {
  return languageList.map((item) => ({
    lang: item.code,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = lang as Language;
  const dict = dictionaries[currentLang];

  if (!dict) {
    return {};
  }

  const baseUrl = 'https://pinterclip.com';
  const canonicalUrl = currentLang === 'en' ? baseUrl : `${baseUrl}/${currentLang}`;

  const alternateLanguages: Record<string, string> = {
    'x-default': baseUrl,
    'en': baseUrl,
  };

  languageList.forEach((item) => {
    alternateLanguages[item.code] = item.code === 'en' ? baseUrl : `${baseUrl}/${item.code}`;
  });

  return {
    title: `${dict.title} - PinterClip`,
    description: dict.subtitle,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: `${dict.title} - PinterClip`,
      description: dict.subtitle,
      url: canonicalUrl,
      siteName: 'PinterClip',
      locale: currentLang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.title} - PinterClip`,
      description: dict.subtitle,
    },
  };
}

export default async function LocalizedPage({ params }: Props) {
  const { lang } = await params;
  const currentLang = lang as Language;
  const dict = dictionaries[currentLang];

  if (!dict) {
    notFound();
  }

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
    'url': currentLang === 'en' ? 'https://pinterclip.com' : `https://pinterclip.com/${currentLang}`,
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
      <PinterClipApp initialLang={currentLang} />
    </>
  );
}
