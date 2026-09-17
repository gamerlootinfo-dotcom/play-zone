'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, HelpCircle, CheckCircle, Flame, Skull, Moon, Sun } from 'lucide-react';
import { sounds, triggerHaptic } from '@/utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  const [selectedGameRules, setSelectedGameRules] = useState<'imposter' | 'mafia'>('imposter');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-game-card border border-purple-500/30 p-6 md:p-8 space-y-6 shadow-2xl shadow-purple-950/60 text-left custom-scrollbar">
        {/* Close button */}
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

        {/* Header Tabs */}
        <div className="space-y-3">
          <h3 className="text-xl font-extrabold text-white">Oyun Qaydaları</h3>
          <div className="flex gap-2 p-1 rounded-2xl bg-game-dark border border-game-border">
            <button
              onClick={() => {
                sounds.playClick();
                setSelectedGameRules('imposter');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedGameRules === 'imposter'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>İmposter</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setSelectedGameRules('mafia');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedGameRules === 'mafia'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Skull className="w-3.5 h-3.5" />
              <span>Klassik Mafia</span>
            </button>
          </div>
        </div>

        {/* IMPOSTER RULES */}
        {selectedGameRules === 'imposter' && (
          <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed animate-fadeIn">
            <div className="p-4 rounded-2xl bg-game-dark/80 border border-game-border/70 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                1. Sözlərin Paylanması
              </h4>
              <p>
                Hər oyunçu öz növbəsində kartı basıb saxlayaraq gizli sözünü öyrənir. Dinc sakinlərə eyni bir söz (məs: <em>Çay</em>), İmposterlərə isə bənzər gizli söz (məs: <em>Qəhvə</em>) verilir.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-game-dark/80 border border-game-border/70 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-pink-400" />
                2. Müzakirə və Təsvir
              </h4>
              <p>
                Sistem təsadüfi bir oyunçunu ilk başlayıcı seçir. Hər kəs növbə ilə öz sözünü birbaşa demədən qısa bir ipucu və ya cümlə ilə təsvir edir.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-game-dark/80 border border-game-border/70 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                3. Səsvermə və Qələbə
              </h4>
              <p>
                Dinc sakinlər şübhəli danışan İmposteri tapmağa çalışır. Müzakirə bitdikdə "İmposterləri Aç" düyməsinə klikləyərək bütün rollar ifşa olunur!
              </p>
            </div>
          </div>
        )}

        {/* MAFIA RULES */}
        {selectedGameRules === 'mafia' && (
          <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed animate-fadeIn">
            <div className="p-4 rounded-2xl bg-game-dark/80 border border-game-border/70 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-red-400" />
                1. Gecə Mərhələsi
              </h4>
              <p>
                Şəhər yatır. Növbə ilə Mafiya və Don oyanıb bir qurban seçir, Komissar şübhələndiyi bir şəxsin rolunu yoxlayır, Həkim isə bir nəfəri ölümdən xilas edir.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-game-dark/80 border border-game-border/70 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                2. Gündüz Mərhələsi
              </h4>
              <p>
                Səhər açılır. Gecə qurbanı elan edilir. Sağ qalan sakinlər və mafiyalar birgə müzakirə edərək günün şübhəlisini səsvermə ilə şəhərdən çıxarmağa çalışır.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-game-dark/80 border border-game-border/70 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Skull className="w-4 h-4 text-rose-400" />
                3. Qələbə Şərtləri
              </h4>
              <p>
                Bütün Mafiyalar çıxarılarsa — <strong>Dinc Sakinlər</strong> qalib gəlir. Mafiya sayı sağ qalan dinc sakinlərin sayına bərabər olarsa — <strong>Mafiya</strong> qalib gəlir!
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            sounds.playClick();
            triggerHaptic(20);
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all"
        >
          Aydındır, Bağla
        </button>
      </div>
    </div>
  );
}
