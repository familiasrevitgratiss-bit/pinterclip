'use client';

import React from 'react';
import Link from 'next/link';
import { Translation, Language } from '@/lib/dictionary';
import { LanguageDropdown } from './LanguageDropdown';

interface FooterProps {
  dict: Translation;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Footer: React.FC<FooterProps> = ({ dict, currentLang, onLanguageChange }) => {
  return (
    <footer className="w-full bg-[#0b0e14] border-t border-slate-800 py-12 px-4 mt-16 text-slate-500 text-xs">
      <div className="max-w-5xl mx-auto space-y-8 text-center">
        
        {/* Brand Center */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#e60023] to-[#ff4757] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0e14] rounded-[6px] flex items-center justify-center">
                <span className="text-[#e60023] font-black text-sm">P</span>
              </div>
            </div>
            <span className="text-base font-black tracking-tight text-white">
              Pinter<span className="text-[#e60023]">Clip</span>.com
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {dict.footerRights}
          </p>
        </div>

        {/* Cross-linking of Tools */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {dict.crossLinksTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/pinterest-to-mp4"
              className="px-3.5 py-1.5 bg-[#161b22] border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-[#e60023]/50 transition text-xs font-semibold shadow-sm"
            >
              {dict.toolPinterestToMp4}
            </Link>
            <Link
              href="/pinterest-image-downloader"
              className="px-3.5 py-1.5 bg-[#161b22] border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-[#e60023]/50 transition text-xs font-semibold shadow-sm"
            >
              {dict.toolPinterestImage}
            </Link>
            <Link
              href="/pinterest-gif-downloader"
              className="px-3.5 py-1.5 bg-[#161b22] border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-[#e60023]/50 transition text-xs font-semibold shadow-sm"
            >
              {dict.toolPinterestGif}
            </Link>
            <Link
              href="/pinterest-video-downloader"
              className="px-3.5 py-1.5 bg-[#161b22] border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-[#e60023]/50 transition text-xs font-semibold shadow-sm"
            >
              {dict.toolPinterestReels || dict.toolPinterestToMp3}
            </Link>
          </div>
        </div>

        {/* Cross-network Family Links */}
        <div className="space-y-2 pt-2 border-t border-slate-800/40">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {dict.networkFamilyTitle || 'CLIP NETWORK FAMILY'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <a
              href="https://reddclip.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#ff4500] transition"
            >
              {dict.networkFamilyReddit || 'ReddClip.com - Reddit Video Downloader'}
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="https://twitsclip.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#1d9bf0] transition"
            >
              {dict.networkFamilyTwitter || 'TwitsClip.com - Twitter / X Video Downloader'}
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="https://tokyclip.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#fe2c55] transition"
            >
              {dict.networkFamilyTikTok || 'TokyClip.com - TikTok Video Downloader'}
            </a>
          </div>
        </div>

        {/* Bottom Language Selector */}
        <div className="pt-2 flex justify-center">
          <LanguageDropdown
            currentLang={currentLang}
            onLanguageChange={onLanguageChange}
            direction="up"
          />
        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-2xl mx-auto space-y-2 text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/60 pt-6">
          <p>
            <strong>{dict.disclaimerTitle}</strong> {dict.disclaimerP1}
          </p>
          <p>
            {dict.disclaimerP2}
          </p>
        </div>

        {/* Legal Links (Strictly no admin button) */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
          <Link href="/terms" className="hover:text-white transition">{dict.footerTerms}</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-white transition">{dict.footerPrivacy}</Link>
          <span>•</span>
          <Link href="/dmca" className="hover:text-white transition">{dict.footerDmca}</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-white transition">{dict.footerContact}</Link>
        </div>

      </div>
    </footer>
  );
};
