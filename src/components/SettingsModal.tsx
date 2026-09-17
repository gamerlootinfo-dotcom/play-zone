'use client';

import React from 'react';
import { X, Heart, Smartphone, Sparkles, Volume2, VolumeX, Shield } from 'lucide-react';
import { sounds, triggerHaptic } from '@/utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-game-card border border-purple-500/30 p-6 md:p-8 space-y-6 shadow-2xl shadow-purple-950/60 text-left">
        <button
          onClick={() => {
            sounds.playClick();
            triggerHaptic(20);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-game-dark border border-game-border text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Platforma Haqqında</h3>
            <p className="text-xs text-pink-400">PlayZone Game Hub</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Səs Ayarı */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-game-dark/80 border border-game-border">
            <div className="flex items-center gap-3">
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
              <div>
                <div className="text-sm font-bold text-white">Səs Effektləri</div>
                <div className="text-[11px] text-gray-400">Kart çevrilmə və oyun səsləri</div>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onToggleMute();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !isMuted
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}
            >
              {!isMuted ? 'Aktiv' : 'Səssiz'}
            </button>
          </div>

          {/* Mobil Home Bar Qeydi */}
          <div className="p-4 rounded-2xl bg-game-dark/80 border border-game-border space-y-1.5 text-xs text-gray-300">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <Smartphone className="w-4 h-4" />
              <span>Mobil Təcrübə</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Bu platforma smartfonlar və planşetlərdə alt naviqasiya (home bar) və toxunma jestləri ilə tam optimallaşdırılıb.
            </p>
          </div>

          {/* Müəllif */}
          <div className="text-center pt-2 text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <span>Dostlarla unudulmaz oyun anları üçün yaradıldı</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            triggerHaptic(20);
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-game-dark hover:bg-game-border text-white text-xs font-bold border border-game-border transition-colors"
        >
          Bağla
        </button>
      </div>
    </div>
  );
}
