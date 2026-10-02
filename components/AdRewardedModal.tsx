'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, ShieldAlert, CheckCircle2, Download } from 'lucide-react';
import { Translation } from '@/lib/dictionary';

interface AdRewardedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteDownload: () => void;
  formatTitle: string;
  dict: Translation;
  cooldownSeconds?: number;
}

export const AdRewardedModal: React.FC<AdRewardedModalProps> = ({
  isOpen,
  onClose,
  onCompleteDownload,
  formatTitle,
  dict,
  cooldownSeconds = 5,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(cooldownSeconds);
  const [canClose, setCanClose] = useState(cooldownSeconds <= 0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const initialSeconds = typeof cooldownSeconds === 'number' ? cooldownSeconds : 5;
    if (!isOpen) {
      setSecondsLeft(initialSeconds);
      setCanClose(initialSeconds <= 0);
      setShowWarning(false);
      return;
    }

    if (initialSeconds <= 0) {
      setSecondsLeft(0);
      setCanClose(true);
      return;
    }

    setSecondsLeft(initialSeconds);
    setCanClose(false);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, cooldownSeconds]);

  if (!isOpen) return null;

  const handleAttemptClose = () => {
    if (canClose) {
      onCompleteDownload();
      onClose();
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#12161d] border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
        
        {/* Close Button Top Right */}
        <button
          onClick={handleAttemptClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition ${
            canClose
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
              : 'bg-slate-900 text-slate-600 cursor-not-allowed'
          }`}
          title={canClose ? dict.rewardedCloseBtn : 'Espera el temporizador'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#e60023] to-[#ff4757] p-0.5 flex items-center justify-center shadow-lg shadow-[#e60023]/25">
          <div className="w-full h-full bg-[#12161d] rounded-[14px] flex items-center justify-center text-[#e60023]">
            {canClose ? <CheckCircle2 className="w-7 h-7 text-emerald-400" /> : <Play className="w-7 h-7 fill-current" />}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-white">
            {canClose ? '¡Descarga Desbloqueada!' : dict.rewardedAdTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {canClose ? `Tu archivo en calidad ${formatTitle} está listo para descargar.` : dict.rewardedAdSubtitle}
          </p>
        </div>

        {/* Central Counter or Ad Slot */}
        <div className="py-6 px-4 rounded-2xl bg-[#0b0e14] border border-slate-800/80 space-y-3">
          {canClose ? (
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                ✓ Recompensa completada
              </span>
              <p className="text-xs text-slate-300">
                Haz clic en el botón de abajo para iniciar la descarga inmediata.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl font-black font-mono text-[#e60023]">
                {secondsLeft}s
              </div>
              <p className="text-xs text-slate-400">
                {dict.rewardCountdown}
              </p>
            </div>
          )}
        </div>

        {/* Early exit warning */}
        {showWarning && !canClose && (
          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs text-left animate-in shake duration-200">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{dict.rewardedRewardWarning}</span>
          </div>
        )}

        {/* Action Button */}
        {canClose ? (
          <button
            onClick={() => {
              onCompleteDownload();
              onClose();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{dict.rewardedContinueBtn}</span>
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed"
          >
            <span>Espera {secondsLeft} segundos...</span>
          </button>
        )}

      </div>
    </div>
  );
};
