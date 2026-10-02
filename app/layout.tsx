import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSiteConfig } from "@/lib/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pinterclip.com'),
  title: "Download Pinterest Videos for Free (HD 1080p) - PinterClip",
  description: "Download Pinterest videos, original photos, and GIFs in Full HD 1080p for free. Fast, secure, and no watermark Pinterest downloader.",
  keywords: [
    "download pinterest videos for free",
    "descargar videos de pinterest gratis",
    "pinterest video downloader",
    "pinterest downloader",
    "download pinterest video",
    "pinterest image downloader",
    "descargar videos de pinterest",
    "pinterest to mp4",
    "pinterest pin downloader",
    "pinterest photo download original"
  ],
  authors: [{ name: "PinterClip Team" }],
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'es': '/es',
      'de': '/de',
      'fr': '/fr',
      'it': '/it',
      'pt': '/pt',
      'id': '/id',
      'ja': '/ja',
      'ko': '/ko',
      'pl': '/pl',
      'ru': '/ru',
      'tr': '/tr',
      'uk': '/uk',
      'zh': '/zh',
      'x-default': '/',
    }
  },
  openGraph: {
    title: "PinterClip - Pinterest Video & Image Downloader (HD 1080p)",
    description: "Download Pinterest videos with sound, original photos, and GIFs in Full HD 1080p for free.",
    url: "https://pinterclip.com",
    siteName: "PinterClip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PinterClip - Pinterest Video & Image Downloader",
    description: "Download Pinterest videos and original images in HD for free.",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();
  const adsenseId = config?.monetization?.adsensePublisherId;
  const cfAnalyticsToken = config?.cloudflare?.analyticsToken;
  const headScripts = config?.codeInjection?.headScripts;
  const bodyScripts = config?.codeInjection?.bodyScripts;

  // JSON-LD structured data for Google Search rich snippet
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PinterClip",
    "url": "https://pinterclip.com",
    "description": "Free online Pinterest video and image downloader in Full HD 1080p.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
        {headScripts && (
          <div
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: headScripts }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#0b0e14] text-slate-100">
        {children}
        {cfAnalyticsToken && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cfAnalyticsToken}"}`}
          />
        )}
        {bodyScripts && (
          <div
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: bodyScripts }}
          />
        )}
      </body>
    </html>
  );
}
