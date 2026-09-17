'use client';

import React from 'react';
import { Play, Users, Eye, Sparkles, Flame, ShieldAlert, Skull, Zap } from 'lucide-react';
import { GameType } from '@/types';
import { sounds, triggerHaptic } from '@/utils/audio';

interface LobbyProps {
  onSelectGame: (game: GameType) => void;
  onOpenRules: () => void;
}

export default function Lobby({ onSelectGame, onOpenRules }: LobbyProps) {
  const handleGameClick = (game: GameType) => {
    sounds.playClick();
    triggerHaptic(30);
    onSelectGame(game);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn">
      {/* Banner / Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-cyan-900/50 border border-purple-500/30 p-6 md:p-10 shadow-2xl shadow-purple-950/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              <span>Dostlarla Əyləncə Platforması</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Oyununu Seç və <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Macəraya Başla!
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-300">
              Telefonu əldən-ələ ötürərək dostlarınızla ən maraqlı gizli rol və partiya oyunlarını oynayın.
            </p>
          </div>

          <button
            onClick={() => handleGameClick('imposter')}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            <span>İmposter Oyna</span>
          </button>
        </div>
      </div>

      {/* Oyunlar Kataloqu Bölməsi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-pink-400" />
            <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
              Mövcud Oyunlar
            </h3>
          </div>
          <button
            onClick={onOpenRules}
            className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4"
          >
            Qaydalar necədir?
          </button>
        </div>

        {/* Oyun Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. İMPOSTER (Aktiv Əsas Oyun) */}
          <div
            onClick={() => handleGameClick('imposter')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-b from-game-card to-game-cardHover border-2 border-purple-500/40 hover:border-purple-400 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />

            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-red-500 p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-game-dark rounded-[14px] flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7 text-red-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Aktiv Oyun
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                İmposter (Casus)
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Hamıya eyni söz verilir, yalnız İmposterlərə fərqli! Kartı basıb saxlayın, sözünüzü öyrənin və casusu tapın.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-game-border/80 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>3-20 Oyunçu</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Başla</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>

          {/* 2. SPY / Casus (Tezliklə) */}
          <div className="relative overflow-hidden rounded-2xl bg-game-card/50 border border-game-border/50 p-6 opacity-75 hover:opacity-90 transition-opacity">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5">
                <div className="w-full h-full bg-game-dark rounded-[14px] flex items-center justify-center">
                  <Eye className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                Tezliklə
              </span>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-gray-200">Məkan Casusu (Spyfall)</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hamı məkanı bilir, casus isə harada olduğunu bilmir. Suallarla casusu ifşa edin!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-game-border/40 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>3-12 Oyunçu</span>
              </div>
              <span className="text-gray-400">Tezliklə</span>
            </div>
          </div>

          {/* 2. MAFIA (Aktiv Oyun) */}
          <div
            onClick={() => handleGameClick('mafia')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-b from-game-card to-game-cardHover border-2 border-red-500/40 hover:border-red-400 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />

            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-600 p-0.5 shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-game-dark rounded-[14px] flex items-center justify-center">
                  <Skull className="w-7 h-7 text-red-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Aktiv Oyun
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-white group-hover:text-red-300 transition-colors flex items-center gap-2">
                Klassik Mafia
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Şəhər yatır, mafiya oyanır! Don, Komissar, Həkim və Dinc Sakinlər rolları ilə əfsanəvi psixoloji partiya oyunu.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-game-border/80 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-red-400" />
                <span>4-20 Oyunçu</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-red-400 group-hover:translate-x-1 transition-transform">
                <span>Başla</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hər İki Oyunun İzahı Bölməsi */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
            Oyunların İzahı və Qaydaları
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. İMPOSTER İZAHI */}
          <div className="rounded-3xl bg-gradient-to-b from-purple-950/40 via-game-card to-game-card border border-purple-500/30 p-5 md:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="font-extrabold text-white text-base">
                  İmposter (Casus) Necə Oynanılır?
                </h4>
              </div>
              <span className="text-[11px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                3-20 Oyunçu
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-game-dark/70 border border-purple-500/20 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-200 flex items-center justify-center text-[10px]">1</span>
                  <span>Sözlərin Gizli Baxışı</span>
                </div>
                <p className="text-xs text-gray-300 pl-7 leading-relaxed">
                  Hər kəs telefonu növbə ilə götürür və kartı basıb saxlayaraq gizli sözünü öyrənir. Dinc sakinlərə eyni söz (məsələn, <em>"Çay"</em>), İmposterlərə isə bənzər söz (məsələn, <em>"Qəhvə"</em>) verilir.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-game-dark/70 border border-purple-500/20 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-pink-300">
                  <span className="w-5 h-5 rounded-full bg-pink-600/40 text-pink-200 flex items-center justify-center text-[10px]">2</span>
                  <span>İpucu və Müzakirə</span>
                </div>
                <p className="text-xs text-gray-300 pl-7 leading-relaxed">
                  Ruletka təsadüfi bir oyunçunu ilk başlayıcı seçir. Hər kəs növbə ilə öz sözünü birbaşa demədən ona aid qısa bir ipucu və ya assosiasiya bildirir. İmposter isə fərq edilməməyə çalışır.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-game-dark/70 border border-purple-500/20 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <span className="w-5 h-5 rounded-full bg-cyan-600/40 text-cyan-200 flex items-center justify-center text-[10px]">3</span>
                  <span>Səsvermə və İfşa</span>
                </div>
                <p className="text-xs text-gray-300 pl-7 leading-relaxed">
                  Müzakirə nəticəsində oyunçular şübhələndikləri casusu səsvermə ilə təyin edir. Sonda "İmposterləri Aç" düyməsinə basaraq bütün gizli sözlər və casuslar ifşa olunur!
                </p>
              </div>
            </div>
          </div>

          {/* 2. MAFİA İZAHI */}
          <div className="rounded-3xl bg-gradient-to-b from-red-950/40 via-game-card to-game-card border border-red-500/30 p-5 md:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center">
                  <Skull className="w-4 h-4 text-red-400" />
                </div>
                <h4 className="font-extrabold text-white text-base">
                  Klassik Mafia Necə Oynanılır?
                </h4>
              </div>
              <span className="text-[11px] font-bold text-red-300 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                4-20 Oyunçu
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-game-dark/70 border border-red-500/20 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                  <span className="w-5 h-5 rounded-full bg-red-600/40 text-red-200 flex items-center justify-center text-[10px]">1</span>
                  <span>Rolların Paylanması</span>
                </div>
                <p className="text-xs text-gray-300 pl-7 leading-relaxed">
                  Oyunçular kartı basıb saxlayaraq gizli rollarını (Mafiya 🕵️‍♂️, Don 👑, Komissar ⭐, Həkim 💉, Dinc Sakin 🛡️) öyrənirlər. Mafiyalar komanda yoldaşlarını da ekranda görür.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-game-dark/70 border border-red-500/20 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <span className="w-5 h-5 rounded-full bg-amber-600/40 text-amber-200 flex items-center justify-center text-[10px]">2</span>
                  <span>Gecə və Gündüz Fəaliyyətləri</span>
                </div>
                <p className="text-xs text-gray-300 pl-7 leading-relaxed">
                  <strong>Gecə:</strong> Şəhər yatır. Mafiyalar qurban seçir, Komissar şübhəlinin rolunu yoxlayır, Həkim bir nəfəri sağaldır.<br />
                  <strong>Gündüz:</strong> Şəhər oyanır, gecə qurbanı elan olunur və sakinlər müzakirə aparır.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-game-dark/70 border border-red-500/20 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-600/40 text-emerald-200 flex items-center justify-center text-[10px]">3</span>
                  <span>Səsvermə və Qələbə</span>
                </div>
                <p className="text-xs text-gray-300 pl-7 leading-relaxed">
                  Gündüz səsvermə ilə şübhəli şəxs oyundan çıxarılır. Bütün mafiyalar aradan qaldırılsa <strong>Dinc Sakinlər</strong>, mafiya sayı dinc sakinlərə çatarsa <strong>Mafiya</strong> qalib gəlir!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
