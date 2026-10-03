'use client';

import React, { useState } from 'react';
import { Link2, Clipboard, AlertCircle, Check } from 'lucide-react';
import { Translation } from '@/lib/dictionary';
import { ExtractResult } from '@/app/api/extract/route';

interface DownloaderFormProps {
  dict: Translation;
  mediaMode?: 'video' | 'image' | 'gif' | 'mp3';
  onSuccess: (data: ExtractResult) => void;
}

export const DownloaderForm: React.FC<DownloaderFormProps> = ({ dict, mediaMode, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setError(null);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch {
      setError(dict.inputPlaceholder);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError(dict.inputPlaceholder);
      return;
    }

    setLoading(true);
    setProgress(5);
    setCurrentStep(1);
    setError(null);

    const startTime = Date.now();
    const TARGET_DURATION_MS = 2500;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(99, Math.round((elapsed / TARGET_DURATION_MS) * 100));

      setProgress(calculatedProgress);

      if (calculatedProgress < 25) {
        setCurrentStep(1);
      } else if (calculatedProgress < 55) {
        setCurrentStep(2);
      } else if (calculatedProgress < 85) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
    }, 50);

    try {
      const fetchPromise = fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), mediaMode }),
      }).then((res) => res.json());

      const [data] = await Promise.all([
        fetchPromise,
        new Promise((resolve) => setTimeout(resolve, TARGET_DURATION_MS)),
      ]);

      clearInterval(progressInterval);

      if (!data.success) {
        setError(data.error || dict.inputPlaceholder);
        setLoading(false);
        setProgress(0);
      } else {
        setProgress(100);
        setCurrentStep(4);
        setTimeout(() => {
          onSuccess(data);
          setLoading(false);
          setProgress(0);
        }, 300);
      }
    } catch {
      clearInterval(progressInterval);
      setError(dict.inputPlaceholder);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* If loading, display progress bar */}
      {loading ? (
        <div className="bg-[#12161d] border border-[#e60023]/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e60023] animate-ping"></span>
              <span className="text-slate-200">{dict.processing}</span>
            </div>
            <span className="text-[#e60023] font-mono text-base font-black">
              {progress}%
            </span>
          </div>

          {/* Smooth progress bar */}
          <div className="w-full bg-[#1b222c] rounded-full h-3 overflow-hidden border border-slate-700/60">
            <div
              className="bg-gradient-to-r from-[#e60023] to-[#ff4757] h-full rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* 4 Step indicators */}
          <div className="flex items-center justify-center gap-4 pt-1">
            {[1, 2, 3, 4].map((step) => {
              const isDone = currentStep > step || progress === 100;
              const isCurrent = currentStep === step && progress < 100;

              return (
                <div key={step} className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-[#e60023] text-white animate-pulse'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : step}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-center font-mono">
            {currentStep === 1 && dict.progressStep1}
            {currentStep === 2 && dict.progressStep2}
            {currentStep === 3 && dict.progressStep3}
            {currentStep >= 4 && dict.progressStep4}
          </p>

        </div>
      ) : (
        /* Normal Input Form */
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-[#161b22] border-2 border-slate-700/80 hover:border-slate-600 focus-within:border-[#e60023] rounded-2xl p-1.5 shadow-2xl transition duration-200 gap-1.5">
            
            {/* Input with icon */}
            <div className="flex items-center flex-1 px-3 py-2 sm:py-0">
              <Link2 className="w-5 h-5 text-slate-500 mr-2 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={dict.inputPlaceholder}
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 px-1 pb-1 sm:px-0 sm:pb-0">
              <button
                type="button"
                onClick={handlePaste}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-[#0b0e14] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>{pasteSuccess ? (dict.pastedSuccess || 'Pasted!') : dict.pasteBtn}</span>
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-[#e60023] to-[#d0001f] hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#e60023]/25 transition"
              >
                <span>{dict.downloadBtn}</span>
              </button>
            </div>

          </div>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Small Legal Disclaimer */}
      <p className="text-[11px] text-slate-500 text-center">
        {dict.adDisclaimer}
      </p>
    </div>
  );
};
