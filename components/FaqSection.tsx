'use client';

import React, { useState } from 'react';
import { ChevronDown, Ban, Video, Zap, Shield, Check, HelpCircle, Copy, Link, Download, Image as ImageIcon, Film, Music, Smartphone, Laptop } from 'lucide-react';
import { Translation } from '@/lib/dictionary';

interface FaqSectionProps {
  dict: Translation;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ dict }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-16 py-10">
      
      {/* 1. Section 'Why choose PinterClip?' */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {dict.featuresTitle.includes('PinterClip') ? (
              <>
                {dict.featuresTitle.split('PinterClip')[0]}
                <span className="text-[#e60023]">PinterClip</span>
                {dict.featuresTitle.split('PinterClip')[1]}
              </>
            ) : (
              dict.featuresTitle
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {dict.featuresSubtitle}
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
              <div className="w-5 h-5 rounded-full bg-[#e60023]/10 border border-[#e60023]/30 text-[#e60023] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>{dict.checklistGallery}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
              <div className="w-5 h-5 rounded-full bg-[#e60023]/10 border border-[#e60023]/30 text-[#e60023] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>{dict.checklistAudio}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
              <div className="w-5 h-5 rounded-full bg-[#e60023]/10 border border-[#e60023]/30 text-[#e60023] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>{dict.checklistUnlimited}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Feature cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#12161d] border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
              <Ban className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">{dict.cardNoWatermarkTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.cardNoWatermarkDesc}
            </p>
          </div>

          <div className="bg-[#12161d] border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-xl bg-[#e60023]/10 border border-[#e60023]/20 text-[#e60023] flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">{dict.card1080Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.card1080Desc}
            </p>
          </div>

          <div className="bg-[#12161d] border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">{dict.cardUltraFastTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.cardUltraFastDesc}
            </p>
          </div>

          <div className="bg-[#12161d] border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">{dict.cardSecureTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.cardSecureDesc}
            </p>
          </div>
        </div>

      </section>

      {/* 2. How it works Section */}
      <section className="text-center space-y-8 pt-6 border-t border-slate-800/80">
        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {dict.howItWorksTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {dict.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center space-y-3 p-5 bg-[#12161d] border border-slate-800 rounded-2xl hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-full bg-[#e60023]/15 border border-[#e60023]/30 text-[#e60023] flex items-center justify-center shadow-lg shadow-[#e60023]/10">
              <Copy className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">{dict.step1Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
              {dict.step1Desc}
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-5 bg-[#12161d] border border-slate-800 rounded-2xl hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-full bg-[#e60023]/15 border border-[#e60023]/30 text-[#e60023] flex items-center justify-center shadow-lg shadow-[#e60023]/10">
              <Link className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">{dict.step2Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
              {dict.step2Desc}
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-5 bg-[#12161d] border border-slate-800 rounded-2xl hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-full bg-[#e60023]/15 border border-[#e60023]/30 text-[#e60023] flex items-center justify-center shadow-lg shadow-[#e60023]/10">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">{dict.step3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
              {dict.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 3. All-in-one Section */}
      <section className="text-center space-y-8 pt-6 border-t border-slate-800/80">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {dict.allInOneTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {dict.allInOneSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-[#12161d] border border-slate-800 space-y-2 hover:border-slate-700 transition">
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-[#e60023]" />
              <h3 className="text-sm font-bold text-white">{dict.aioVideoTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.aioVideoDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12161d] border border-slate-800 space-y-2 hover:border-slate-700 transition">
            <div className="flex items-center gap-2.5">
              <Film className="w-4 h-4 text-[#e60023]" />
              <h3 className="text-sm font-bold text-white">{dict.aioGifTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.aioGifDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12161d] border border-slate-800 space-y-2 hover:border-slate-700 transition">
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4 text-[#e60023]" />
              <h3 className="text-sm font-bold text-white">{dict.aioGalleryTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.aioGalleryDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12161d] border border-slate-800 space-y-2 hover:border-slate-700 transition">
            <div className="flex items-center gap-2.5">
              <Music className="w-4 h-4 text-[#e60023]" />
              <h3 className="text-sm font-bold text-white">{dict.aioAudioTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.aioAudioDesc}
            </p>
          </div>
        </div>
      </section>

      {/* 3.5. Device Compatibility (iOS, Android, PC) */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {dict.devicesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {dict.devicesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#12161d] border border-slate-800 space-y-3 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">{dict.deviceIosTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{dict.deviceIosDesc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12161d] border border-slate-800 space-y-3 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">{dict.deviceAndroidTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{dict.deviceAndroidDesc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12161d] border border-slate-800 space-y-3 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-[#e60023]/10 border border-[#e60023]/20 text-[#e60023] flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">{dict.devicePcTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{dict.devicePcDesc}</p>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="space-y-4 pt-6 border-t border-slate-800/80">
        <h2 className="text-xl sm:text-2xl font-black text-center text-white flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#e60023]" />
          <span>{dict.faqTitle}</span>
        </h2>

        <div className="space-y-2.5">
          {dict.faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#12161d] border border-slate-800 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-200 hover:text-white transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isOpen ? 'rotate-180 text-[#e60023]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
