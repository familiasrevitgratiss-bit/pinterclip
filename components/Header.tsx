'use client';

import React from 'react';
import { Language } from '@/lib/dictionary';
import { LanguageDropdown } from './LanguageDropdown';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onResetHome?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onResetHome,
  theme = 'dark',
  onToggleTheme,
}) => {
  const handleClickLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.location.href = currentLang === 'en' ? '/' : `/${currentLang}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0e14]/90 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & URL Clickable to reset Home */}
        <a
          href="/"
          onClick={handleClickLogo}
          className="flex items-center gap-3 group text-left transition focus:outline-none cursor-pointer select-none"
          title="PinterClip Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e60023] to-[#ff4757] p-0.5 flex items-center justify-center shadow-lg shadow-[#e60023]/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center">
              <span className="text-[#e60023] font-black text-xl tracking-tighter">P</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white flex items-center group-hover:text-slate-200">
              Pinter<span className="text-[#e60023]">Clip</span>
              <span className="text-xs text-slate-500 ml-1">.com</span>
            </span>
            <span className="px-1.5 py-0.5 bg-[#e60023]/10 border border-[#e60023]/30 text-[#e60023] rounded text-[9px] font-bold uppercase tracking-wider">
              Ultra HD
            </span>
          </div>
        </a>

        {/* Right Controls: Theme Toggle + Language Selector */}
        <div className="flex items-center gap-2.5">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-700 hover:border-slate-500 bg-[#161b22] text-slate-200 hover:text-white transition shadow-sm flex items-center justify-center cursor-pointer"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          )}

          <LanguageDropdown
            currentLang={currentLang}
            onLanguageChange={onLanguageChange}
            direction="down"
          />
        </div>

      </div>
    </header>
  );
};
