'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Language, languageList } from '@/lib/dictionary';

interface LanguageDropdownProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  direction?: 'up' | 'down';
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLang,
  onLanguageChange,
  direction = 'down',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = languageList.find((l) => l.code === currentLang) || languageList[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] hover:bg-[#1f2630] border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 transition shadow-sm"
      >
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span>{currentOption.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? (direction === 'up' ? '' : 'rotate-180') : (direction === 'up' ? 'rotate-180' : '')
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 z-50 w-48 max-h-72 overflow-y-auto bg-[#14181f] border border-slate-700/80 rounded-xl shadow-2xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent ${
            direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {languageList.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-[#e60023]/15 text-[#e60023] font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {lang.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
