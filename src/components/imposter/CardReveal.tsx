'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Sparkles, ArrowRight, Eye, Lock, RefreshCw } from 'lucide-react';
import { Player } from '@/types';
import { sounds, triggerHaptic } from '@/utils/audio';

interface CardRevealProps {
  players: Player[];
  wordPairCategory: string;
  wordPairIcon: string;
  onAllCardsRevealed: () => void;
  onResetGame: () => void;
}

export default function CardReveal({
  players,
  wordPairCategory,
  wordPairIcon,
  onAllCardsRevealed,
  onResetGame,
}: CardRevealProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [hasViewedCurrent, setHasViewedCurrent] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;

  // Yeni oyunçuya keçdikdə kart vəziyyətini sıfırla
  useEffect(() => {
    setIsHolding(false);
    setHasViewedCurrent(false);
  }, [currentIndex]);

  const startHold = () => {
    setIsHolding(true);
    setHasViewedCurrent(true);

    // Audio & Haptic Feedback - Hər kəs üçün tamamilə eyni neytral səs
    sounds.playReveal();
    triggerHaptic(40);
  };

  const endHold = () => {
    if (isHolding) {
      sounds.playFlipBack();
      triggerHaptic(20);
    }
    setIsHolding(false);
  };

  const handleNextPlayer = () => {
    sounds.playClick();
    triggerHaptic(30);

    if (isLastPlayer) {
      onAllCardsRevealed();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 md:py-8 space-y-6 flex flex-col items-center justify-center animate-fadeIn select-none pb-24 md:pb-12">
      {/* Yuxarı Status & Tərəqqi */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onResetGame();
          }}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-game-card/80 border border-game-border"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sıfırla</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-widest text-purple-400 font-bold">
            Gizli Kart Baxışı
          </span>
          <div className="flex items-center gap-1 mt-1">
            {players.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 bg-purple-400 shadow-sm shadow-purple-400'
                    : i < currentIndex
                    ? 'w-2 bg-purple-600/60'
                    : 'w-2 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        <span className="text-xs font-bold text-gray-300 px-3 py-1.5 rounded-lg bg-game-card/80 border border-game-border">
          {currentIndex + 1} / {players.length}
        </span>
      </div>

      {/* 3D KART KONTEYNERİ (Toxunub Saxlama & Fırlanma) */}
      <div className="w-full flex flex-col items-center gap-4 py-2">
        <div
          className="relative w-full max-w-sm h-96 perspective-1000 cursor-pointer touch-none"
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onTouchCancel={endHold}
        >
          {/* Kart Fırlanma Daxili Qutu */}
          <div
            className={`w-full h-full relative rounded-3xl transition-transform duration-300 transform-style-3d shadow-2xl ${
              isHolding ? 'rotate-y-180 shadow-purple-500/30' : 'shadow-black/60'
            }`}
          >
            {/* === KARTIN ÖN HİSSƏSİ (Oyunçunun Adı və Basıb Saxla Təlimatı) === */}
            <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-b from-game-card via-[#161c2b] to-game-card border-2 border-purple-500/40 p-6 flex flex-col items-center justify-between text-center overflow-hidden">
              {/* Arxa fon parlaq halo */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: currentPlayer.avatarColor }}
              />

              {/* Yuxarı Oyunçu İndikatoru */}
              <div className="w-full flex items-center justify-between z-10">
                <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                  Oyunçu #{currentIndex + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-game-dark border border-game-border flex items-center justify-center text-purple-400">
                  <Lock className="w-4 h-4" />
                </div>
              </div>

              {/* Mərkəz: Avatar və Oyunçu Adı */}
              <div className="flex flex-col items-center gap-3 z-10">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-xl border-2 border-white/20 animate-float"
                  style={{ backgroundColor: currentPlayer.avatarColor }}
                >
                  {currentPlayer.avatarEmoji}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                  {currentPlayer.name}
                </h3>
                <p className="text-xs text-gray-400 max-w-[220px]">
                  Telefonu <strong className="text-white">{currentPlayer.name}</strong> adlı oyunçuya verin
                </p>
              </div>

              {/* Aşağı: Basıb Saxlama İpucu */}
              <div className="w-full z-10 pt-4 border-t border-game-border/60 flex flex-col items-center gap-2">
                <div className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 border border-purple-400/40 flex items-center justify-center gap-2 text-purple-200 font-bold text-xs animate-pulse">
                  <Eye className="w-4 h-4 text-purple-300" />
                  <span>SÖZÜ GÖRMƏK ÜÇÜN BASIB SAXLA</span>
                </div>
                <span className="text-[10px] text-gray-500">
                  Barmağınızı çəkdikdə kart dərhal bağlanacaq
                </span>
              </div>
            </div>

            {/* === KARTIN ARXA HİSSƏSİ (Söz & İmposter Yazısı) === */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border-2 p-6 flex flex-col items-center justify-between text-center overflow-hidden transition-all ${
                currentPlayer.isImposter
                  ? 'bg-gradient-to-b from-[#2a0f12] via-[#1a0c10] to-[#250d12] border-red-500/80 shadow-red-500/40'
                  : 'bg-gradient-to-b from-[#131b2e] via-[#0f172a] to-[#131b2e] border-cyan-400/80 shadow-cyan-500/40'
              }`}
            >
              {/* Yuxarı Kateqoriya İkonu */}
              <div className="w-full flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-gray-300 border border-white/10">
                  <span>{wordPairIcon}</span>
                  <span>{wordPairCategory}</span>
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {currentPlayer.name}
                </span>
              </div>

              {/* MƏRKƏZ: SÖZ VƏ İMPOSTER İŞARƏSİ */}
              <div className="flex flex-col items-center justify-center gap-2 z-10 my-auto w-full px-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  Sənin Gizli Sözün:
                </span>
                <div
                  className={`text-2xl md:text-3xl font-black tracking-wider px-5 py-2 rounded-2xl border-2 backdrop-blur-md ${
                    currentPlayer.isImposter
                      ? 'text-red-400 border-red-500/60 bg-red-950/50'
                      : 'text-cyan-300 border-cyan-400/60 bg-cyan-950/50'
                  }`}
                >
                  {currentPlayer.word}
                </div>

                {/* Rol və Missiya İzahı */}
                {currentPlayer.isImposter ? (
                  <div className="w-full mt-1 p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-red-400">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Sən İmpostersən (Casus)!</span>
                    </div>
                    <p className="text-[11px] text-red-200 leading-snug">
                      🎯 <strong>Vəzifən:</strong> Dinc sakinlərin hansı sözü dediyini tapmağa çalış, onlara uyğun şübhəsiz ipucu ver və özünü ifşa etmə!
                    </p>
                  </div>
                ) : (
                  <div className="w-full mt-1 p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-cyan-300">
                      <span>🛡️</span>
                      <span>Sən Dinc Sakinsən!</span>
                    </div>
                    <p className="text-[11px] text-cyan-200 leading-snug">
                      🎯 <strong>Vəzifən:</strong> Öz sözünə aid incə ipucu ver (sözü birbaşa demə!), digərlərini diqqətlə dinlə və casusu tap!
                    </p>
                  </div>
                )}
              </div>

              {/* Aşağı Təhlükəsizlik Qeydi */}
              <div className="w-full z-10 pt-2 border-t border-white/10">
                <p className="text-[10px] text-gray-400">
                  Sözü yadda saxlayın və barmağınızı kartdan çəkin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ekrana toxunma üçün alternativ interaktiv düymə (Əlavə rahatlıq) */}
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onTouchCancel={endHold}
          className={`w-full max-w-sm py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 select-none active:scale-95 ${
            isHolding
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 scale-[0.98]'
              : 'bg-game-card hover:bg-game-cardHover border border-purple-500/40 text-purple-300'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{isHolding ? 'GÖSTƏRİLİR (BURAXIN Kİ BAĞLANSIN)' : 'BURADA DA BASIB SAXLA'}</span>
        </button>
      </div>

      {/* NÖVBƏTİ DÜYMƏSİ (Aşağıda Sabit / Görünən) */}
      <div className="w-full max-w-sm pt-1 space-y-4">
        <button
          onClick={handleNextPlayer}
          disabled={!hasViewedCurrent}
          className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 shadow-xl ${
            hasViewedCurrent
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-600/30 active:scale-95 cursor-pointer'
              : 'bg-gray-800 text-gray-500 border border-gray-700/50 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{isLastPlayer ? 'OYUNA BAŞLA (İLK BAŞLAYANI SEÇ)' : 'NÖVBƏTİ OYUNÇU'}</span>
          {isLastPlayer ? (
            <Sparkles className="w-5 h-5 text-amber-300" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>

        {/* Rolların İzahı Kartı */}
        <div className="p-4 rounded-2xl bg-game-card/60 border border-game-border text-left space-y-2.5">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
            ℹ️ Rollar Nə İşə Yarayır?
          </span>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="p-2 rounded-xl bg-game-dark/60 border border-game-border/50">
              <strong className="text-cyan-300 flex items-center gap-1 mb-0.5">
                🛡️ Dinc Sakin:
              </strong>
              <p className="text-[11px] text-gray-400">
                Hamı ilə eyni sözü bilir. Məqsədi sözü çox asan demədən casusu çaşdırmaq və müzakirələrdə yalançını tapmaqdır.
              </p>
            </div>
            <div className="p-2 rounded-xl bg-game-dark/60 border border-game-border/50">
              <strong className="text-red-400 flex items-center gap-1 mb-0.5">
                🕵️‍♂️ İmposter (Casus):
              </strong>
              <p className="text-[11px] text-gray-400">
                Fərqli söz alır. Məqsədi digərlərinin sözünü anlamaq, təbii danışaraq diqqət çəkməmək və qalib gəlməkdir.
              </p>
            </div>
          </div>
        </div>

        {!hasViewedCurrent && (
          <p className="text-center text-[11px] text-gray-500 mt-2">
            * Növbətiyə keçmək üçün əvvəlcə kartı basıb saxlayaraq sözünüzə baxın
          </p>
        )}
      </div>
    </div>
  );
}
