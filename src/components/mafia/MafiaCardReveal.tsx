'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Lock, ArrowRight, RefreshCw, ShieldAlert, Sparkles, Users } from 'lucide-react';
import { MafiaPlayer } from '@/types';
import { sounds, triggerHaptic } from '@/utils/audio';

interface MafiaCardRevealProps {
  players: MafiaPlayer[];
  onAllCardsRevealed: () => void;
  onResetGame: () => void;
}

export default function MafiaCardReveal({
  players,
  onAllCardsRevealed,
  onResetGame,
}: MafiaCardRevealProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [hasViewedCurrent, setHasViewedCurrent] = useState(false);

  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;

  useEffect(() => {
    setIsHolding(false);
    setHasViewedCurrent(false);
  }, [currentIndex]);

  const startHold = () => {
    setIsHolding(true);
    setHasViewedCurrent(true);

    // Audio & Haptic Feedback - Hamı üçün eyni neytral səs
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
      {/* Yuxarı Status */}
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
          <span className="text-[11px] uppercase tracking-widest text-red-400 font-bold">
            Mafiya Rol Paylanması
          </span>
          <div className="flex items-center gap-1 mt-1">
            {players.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 bg-red-500 shadow-sm shadow-red-500'
                    : i < currentIndex
                    ? 'w-2 bg-red-800'
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

      {/* 3D KART KONTEYNERİ */}
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
          <div
            className={`w-full h-full relative rounded-3xl transition-transform duration-300 transform-style-3d shadow-2xl ${
              isHolding ? 'rotate-y-180 shadow-red-500/30' : 'shadow-black/60'
            }`}
          >
            {/* === KARTIN ÖNÜ (Oyunçunun Adı) === */}
            <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-b from-game-card via-[#1c1822] to-game-card border-2 border-red-500/40 p-6 flex flex-col items-center justify-between text-center overflow-hidden">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: currentPlayer.avatarColor }}
              />

              <div className="w-full flex items-center justify-between z-10">
                <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                  Oyunçu #{currentIndex + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-game-dark border border-game-border flex items-center justify-center text-red-400">
                  <Lock className="w-4 h-4" />
                </div>
              </div>

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

              <div className="w-full z-10 pt-4 border-t border-game-border/60 flex flex-col items-center gap-2">
                <div className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600/30 via-rose-600/30 to-red-600/30 border border-red-400/40 flex items-center justify-center gap-2 text-red-200 font-bold text-xs animate-pulse">
                  <Eye className="w-4 h-4 text-red-300" />
                  <span>ROLUNU GÖRMƏK ÜÇÜN BASIB SAXLA</span>
                </div>
                <span className="text-[10px] text-gray-500">
                  Barmağınızı çəkdikdə kart dərhal bağlanacaq
                </span>
              </div>
            </div>

            {/* === KARTIN ARXASI (Rol Təyinatı) === */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border-2 p-6 flex flex-col items-center justify-between text-center overflow-hidden transition-all ${
                currentPlayer.role.team === 'black'
                  ? 'bg-gradient-to-b from-[#2e0e13] via-[#1a080b] to-[#2e0e13] border-red-500 shadow-red-500/50'
                  : currentPlayer.role.team === 'neutral'
                  ? 'bg-gradient-to-b from-[#2e200e] via-[#1a1308] to-[#2e200e] border-amber-500 shadow-amber-500/50'
                  : 'bg-gradient-to-b from-[#0e212e] via-[#08151a] to-[#0e212e] border-cyan-500 shadow-cyan-500/50'
              }`}
            >
              <div className="w-full flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-gray-300 border border-white/10">
                  <span>Komanda:</span>
                  <strong className={currentPlayer.role.team === 'black' ? 'text-red-400' : 'text-cyan-400'}>
                    {currentPlayer.role.team === 'black' ? 'Qara (Mafiya)' : currentPlayer.role.team === 'neutral' ? 'Neytral' : 'Qırmızı (Şəhər)'}
                  </strong>
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {currentPlayer.name}
                </span>
              </div>

              {/* Rol Məlumatı */}
              <div className="flex flex-col items-center justify-center gap-2 z-10 my-auto w-full px-2">
                <span className="text-4xl animate-bounce">{currentPlayer.role.icon}</span>
                <div
                  className={`text-xl md:text-2xl font-black tracking-wider px-4 py-1.5 rounded-2xl border-2 backdrop-blur-md ${
                    currentPlayer.role.team === 'black'
                      ? 'text-red-400 border-red-500/60 bg-red-950/60'
                      : currentPlayer.role.team === 'neutral'
                      ? 'text-amber-400 border-amber-500/60 bg-amber-950/60'
                      : 'text-cyan-300 border-cyan-400/60 bg-cyan-950/60'
                  }`}
                >
                  {currentPlayer.role.name}
                </div>

                <p className="text-xs text-gray-300 max-w-[260px] leading-relaxed">
                  {currentPlayer.role.description}
                </p>

                {/* Rolun Dəqiq Vəzifəsi / Missiyası */}
                {currentPlayer.role.mission && (
                  <div className="w-full mt-1 p-2.5 rounded-xl bg-black/50 border border-white/10 text-left space-y-1">
                    <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>Əsas Missiyan:</span>
                    </div>
                    <p className="text-[11px] text-gray-200 leading-snug">
                      {currentPlayer.role.mission}
                    </p>
                    {currentPlayer.role.nightAction && (
                      <div className="pt-1 border-t border-white/10 text-[10px] text-gray-400 flex items-start gap-1">
                        <span className="text-indigo-300 font-bold shrink-0">🌙 Gecə:</span>
                        <span>{currentPlayer.role.nightAction}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Mafiya üçün yoldaşlar */}
                {currentPlayer.allies && currentPlayer.allies.length > 0 && (
                  <div className="mt-1 p-2 rounded-xl bg-red-950/70 border border-red-500/40 text-[11px] text-red-300 w-full">
                    <span className="font-bold flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      Digər Mafiya Yoldaşın:
                    </span>
                    <strong className="text-white block mt-0.5">
                      {currentPlayer.allies.join(', ')}
                    </strong>
                  </div>
                )}
              </div>

              <div className="w-full z-10 pt-2 border-t border-white/10">
                <p className="text-[10px] text-gray-400">
                  Rolunuzu yadda saxlayın və barmağınızı kartdan çəkin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alternativ düymə */}
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onTouchCancel={endHold}
          className={`w-full max-w-sm py-3 px-4 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 select-none active:scale-95 ${
            isHolding
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-[0.98]'
              : 'bg-game-card hover:bg-game-cardHover border border-red-500/40 text-red-300'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{isHolding ? 'GÖSTƏRİLİR (BURAXIN Kİ BAĞLANSIN)' : 'BURADA DA BASIB SAXLA'}</span>
        </button>
      </div>

      {/* Növbəti düyməsi */}
      <div className="w-full max-w-sm pt-1 space-y-4">
        <button
          onClick={handleNextPlayer}
          disabled={!hasViewedCurrent}
          className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 shadow-xl ${
            hasViewedCurrent
              ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-600/30 active:scale-95 cursor-pointer'
              : 'bg-gray-800 text-gray-500 border border-gray-700/50 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{isLastPlayer ? 'OYUNA BAŞLA (APARICI / ARENA)' : 'NÖVBƏTİ OYUNÇU'}</span>
          {isLastPlayer ? <Sparkles className="w-5 h-5 text-amber-300" /> : <ArrowRight className="w-5 h-5" />}
        </button>

        {/* Oyun Daxili Rolların Qısa İzahı Kartı */}
        <div className="p-4 rounded-2xl bg-game-card/60 border border-game-border text-left space-y-2.5">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
            ℹ️ Oyundakı Bütün Rollar Nə İşə Yarayır?
          </span>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-sm">👑</span>
              <div>
                <strong className="text-red-400">Don:</strong> Mafiya lideri, gecə qurbanı seçir və Komissarı axtarır.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm">🕵️‍♂️</span>
              <div>
                <strong className="text-red-400">Mafiya:</strong> Gecə Don ilə birgə dinc sakinlərə hücum edir.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm">⭐</span>
              <div>
                <strong className="text-cyan-400">Komissar:</strong> Gecələr şübhələndiyi 1 nəfərin mafiya olub-olmadığını yoxlayır.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm">💉</span>
              <div>
                <strong className="text-emerald-400">Həkim:</strong> Gecələr 1 nəfəri mafiyanın hücumundan xilas edir.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm">🛡️</span>
              <div>
                <strong className="text-gray-300">Dinc Sakin:</strong> Gündüz müzakirə və səsvermələrlə mafiyanı tapır.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
