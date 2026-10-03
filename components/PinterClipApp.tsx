'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DownloaderForm } from '@/components/DownloaderForm';
import { ResultCard } from '@/components/ResultCard';
import { AdRewardedModal } from '@/components/AdRewardedModal';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { dictionaries, Language } from '@/lib/dictionary';
import { ExtractResult, VideoFormat } from '@/app/api/extract/route';
import { CheckCircle2 } from 'lucide-react';

interface PinterClipAppProps {
  initialLang?: Language;
  customTitle?: string;
  customSubtitle?: string;
  customBadge?: string;
  mediaMode?: 'video' | 'image' | 'gif' | 'mp3';
}

export const PinterClipApp: React.FC<PinterClipAppProps> = ({
  initialLang = 'en',
  customTitle,
  customSubtitle,
  customBadge,
  mediaMode,
}) => {
  const [lang, setLang] = useState<Language>(initialLang);
  const [extractData, setExtractData] = useState<ExtractResult | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(null);
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [rewardedCooldown, setRewardedCooldown] = useState(5);

  // Load public config
  useEffect(() => {
    fetch('/api/public-config')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.rewardedAdCooldownSeconds === 'number') {
          setRewardedCooldown(data.rewardedAdCooldownSeconds);
        }
      })
      .catch(() => {});
  }, []);

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinterclip_theme') as 'dark' | 'light';
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
        document.documentElement.classList.toggle('dark', saved === 'dark');
        document.documentElement.classList.toggle('light', saved === 'light');
      } else {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinterclip_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.classList.toggle('light', next === 'light');
    }
  };

  // Sync with initialLang or URL
  useEffect(() => {
    if (initialLang && dictionaries[initialLang]) {
      setLang(initialLang);
      return;
    }

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
      if (pathname && dictionaries[pathname as Language]) {
        setLang(pathname as Language);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang') as Language;
      if (urlLang && dictionaries[urlLang]) {
        setLang(urlLang);
        return;
      }

      if (navigator.language) {
        const browserCode = navigator.language.slice(0, 2).toLowerCase() as Language;
        if (dictionaries[browserCode]) {
          setLang(browserCode);
        }
      }
    }
  }, [initialLang]);

  const handleLanguageChange = (newLang: Language) => {
    if (typeof window !== 'undefined') {
      const targetPath = newLang === 'en' ? '/' : `/${newLang}`;
      window.location.href = targetPath;
    }
  };

  const handleResetHome = () => {
    setExtractData(null);
    setSelectedFormat(null);
    setIsAdOpen(false);
    setDownloadToast(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', lang === 'en' ? '/' : `/${lang}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const dict = dictionaries[lang] || dictionaries.en;

  // Direct download handler
  const executeDownload = async (targetFormat: VideoFormat) => {
    if (!extractData) return;

    setDownloadToast(dict.downloadProcessing || dict.analyzingPinterest || 'Processing download...');

    try {
      const isAudioOnly = targetFormat.quality?.includes('MP3') || mediaMode === 'mp3';
      const mediaType = extractData.mediaType || targetFormat.type || mediaMode || 'video';
      const directUrl = targetFormat.url || extractData.directUrl || (mediaType === 'image' || mediaType === 'gif' ? extractData.thumbnail : undefined);
      const targetUrl = directUrl || extractData.canonicalUrl || targetFormat.url;

      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          isAudioOnly,
          mediaType,
          directUrl,
          title: extractData.title,
          quality: targetFormat.quality,
          resolution: targetFormat.resolution,
        }),
      });

      const data = await res.json();

      if (data.success && data.downloadUrl) {
        const element = document.createElement('a');
        element.href = data.downloadUrl;
        
        // Clean title for native download
        const cleanTitle = (extractData.title || 'pinterest_pin')
          .replace(/[\/\\?%*:|"<>]/g, '')
          .replace(/[\r\n\t]/g, ' ')
          .replace(/[^\w\s\-\u00C0-\u017F\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/g, '')
          .trim()
          .replace(/\s+/g, '_')
          .replace(/_{2,}/g, '_')
          .slice(0, 70);

        const defaultExt = mediaType === 'image' ? 'jpg' : mediaType === 'gif' ? 'gif' : isAudioOnly ? 'mp3' : 'mp4';
        element.download = data.filename || `${cleanTitle}.${defaultExt}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        setDownloadToast(dict.downloadStarting || `Download started! (${targetFormat.quality})`);
      } else {
        setDownloadToast(dict.downloadError || data.error || 'Error downloading file.');
      }
    } catch {
      setDownloadToast(dict.connectionError || 'Connection error with download engine.');
    }

    setTimeout(() => setDownloadToast(null), 6000);
  };

  const handleSelectFormat = (format: VideoFormat) => {
    setSelectedFormat(format);
    executeDownload(format);
  };

  const handleCompleteDownload = async () => {
    setIsAdOpen(false);
    if (selectedFormat) {
      await executeDownload(selectedFormat);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#e60023] selection:text-white transition-colors duration-200 ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0b0e14] text-slate-100'
    }`}>
      
      {/* Floating success toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161b22] border border-[#e60023]/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-8 h-8 rounded-full bg-[#e60023]/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#e60023]" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-100">{downloadToast}</p>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <Header
        currentLang={lang}
        onLanguageChange={handleLanguageChange}
        onResetHome={handleResetHome}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex justify-center">
        <main className="w-full flex flex-col items-center">
          
          {/* Hero Section */}
          <div className="text-center space-y-3.5 mb-8 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e60023]/10 border border-[#e60023]/25 text-[#e60023] text-xs font-bold uppercase tracking-wider">
              <span>{customBadge || dict.badge}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
              {customTitle || dict.title}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              {customSubtitle || dict.subtitle}
            </p>
          </div>

          {/* Input & Download Form */}
          <DownloaderForm
            dict={dict}
            mediaMode={mediaMode}
            onSuccess={(data: ExtractResult) => {
              setExtractData(data);
              setSelectedFormat(null);
            }}
          />

          {/* Result Card */}
          {extractData && (
            <div className="w-full mt-6 animate-in fade-in zoom-in-95 duration-200">
              <ResultCard
                dict={dict}
                data={extractData}
                onSelectFormat={handleSelectFormat}
                onReset={() => setExtractData(null)}
              />
            </div>
          )}

          {/* Features and FAQ Section */}
          <div className="w-full mt-10">
            <FaqSection dict={dict} />
          </div>

        </main>
      </div>

      {/* Rewarded Ad Modal */}
      <AdRewardedModal
        isOpen={isAdOpen}
        onClose={() => setIsAdOpen(false)}
        onCompleteDownload={handleCompleteDownload}
        formatTitle={selectedFormat?.quality || 'HD 1080p'}
        dict={dict}
        cooldownSeconds={rewardedCooldown}
      />

      {/* Footer */}
      <Footer
        dict={dict}
        currentLang={lang}
        onLanguageChange={handleLanguageChange}
      />

    </div>
  );
};
