'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Users, ShieldAlert, RotateCcw, Eye } from 'lucide-react';
import { Player } from '@/types';
import { sounds, triggerHaptic } from '@/utils/audio';

interface GameArenaProps {
  players: Player[];
  wordPair: { civilian: string; imposter: string; category: string; icon: string };
  onPlayAgain: () => void;
  onNewGameSetup: () => void;
}

export default function GameArena({
  players,
  wordPair,
  onPlayAgain,
  onNewGameSetup,
}: GameArenaProps) {
  // 1. Ruletka / İlk başlayanın seçimi vəziyyəti
  const [isSelectingFirst, setIsSelectingFirst] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [startingPlayer, setStartingPlayer] = useState<Player | null>(null);

  // 2. İfşa vəziyyəti
  const [isTruthRevealed, setIsTruthRevealed] = useState(false);

  // Ruletka Animasiyası
  useEffect(() => {
    if (!isSelectingFirst) return;

    let speed = 60;
    let iterations = 0;
    const maxIterations = 25 + Math.floor(Math.random() * 15);
    const targetIndex = Math.floor(Math.random() * players.length);

    const spin = () => {
      setHighlightedIndex((prev) => (prev + 1) % players.length);
      sounds.playRouletteTick();
      triggerHaptic(15);
      iterations++;

      if (iterations < maxIterations) {
        speed += 12; // Tədricən yavaşla
        setTimeout(spin, speed);
      } else {
        // Qalib təyin olundu
        const winner = players[targetIndex];
        setHighlightedIndex(targetIndex);
        setStartingPlayer(winner);
        sounds.playFanfare();
        triggerHaptic([60, 100, 80]);

        // Konfeti təntənəsi
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b'],
        });

        // 2 saniyə sonra nəticə ekranına keç
        setTimeout(() => {
          setIsSelectingFirst(false);
        }, 2200);
      }
    };

    const initialTimeout = setTimeout(spin, 400);
    return () => clearTimeout(initialTimeout);
  }, [isSelectingFirst, players]);

  const handleRevealTruth = () => {
    sounds.playFanfare();
    triggerHaptic([60, 80, 100]);
    setIsTruthRevealed(true);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  // 1. İLK BAŞLAYANIN SEÇİLMƏSİ (RULETKA EKRANI)
  if (isSelectingFirst) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-10 space-y-8 flex flex-col items-center justify-center text-center animate-fadeIn">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>Təsadüfi Seçim</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Oyuna Kim Başlayır?
          </h2>
          <p className="text-xs text-gray-400">
            İlk sözü deyəcək oyunçu random seçilir...
          </p>
        </div>

        {/* Ruletka Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {players.map((p, idx) => {
            const isTarget = highlightedIndex === idx;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border-2 transition-all duration-150 flex items-center gap-3 ${
                  isTarget
                    ? 'scale-105 border-purple-400 bg-gradient-to-r from-purple-600/40 to-pink-600/40 shadow-xl shadow-purple-500/40'
                    : 'border-game-border bg-game-card opacity-60'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow"
                  style={{ backgroundColor: p.avatarColor }}
                >
                  {p.avatarEmoji}
                </div>
                <span className="font-extrabold text-sm text-white truncate">
                  {p.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Seçilən Oyunçu Banneri */}
        {startingPlayer && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 border-2 border-amber-400/80 w-full max-w-sm animate-bounce shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-sm uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>İlk Başlayan:</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {startingPlayer.name}! 🎯
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. ƏSAS OYUN EKRANI (İLK BAŞLAYAN + İMPOSTERLƏRİ AÇ DÜYMƏSİ)
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 md:py-8 space-y-6 animate-fadeIn pb-24 md:pb-12 text-center">
      {/* İlk Başlayan Oyunçu Kartı */}
      {startingPlayer && (
        <div className="rounded-3xl bg-gradient-to-b from-game-card to-[#181f30] border-2 border-purple-500/40 p-6 md:p-8 space-y-4 shadow-2xl shadow-purple-950/40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Oyuna İlk Başlayan Oyunçu</span>
          </div>

          <div className="flex flex-col items-center gap-3 py-2">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl border-2 border-white/20 animate-float"
              style={{ backgroundColor: startingPlayer.avatarColor }}
            >
              {startingPlayer.avatarEmoji}
            </div>
            <h3 className="text-3xl font-black text-white tracking-wide">
              {startingPlayer.name}
            </h3>
            <p className="text-xs text-gray-300 max-w-xs">
              İlk ipucunu verərək oyuna <strong className="text-amber-300">{startingPlayer.name}</strong> başlayır. Sonra saat əqrəbi istiqamətində davam edin.
            </p>
          </div>

          <div className="pt-3 border-t border-game-border/60 flex items-center justify-between text-xs text-gray-400">
            <span>Kateqoriya:</span>
            <span className="font-bold text-gray-200">
              {wordPair.category} {wordPair.icon}
            </span>
          </div>
        </div>
      )}

      {/* İMPOSTERLƏRİ AÇ DÜYMƏSİ VƏ YA NƏTİCƏLƏR */}
      {!isTruthRevealed ? (
        <div className="space-y-4">
          <button
            onClick={handleRevealTruth}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-black text-base md:text-lg shadow-2xl shadow-red-600/40 hover:shadow-red-600/60 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group animate-pulse-slow"
          >
            <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>İMPOSTERLƏRİ AÇ</span>
          </button>

          {/* Arenada Rolların Taktikası və Vəzifəsi */}
          <div className="p-5 rounded-2xl bg-game-card/70 border border-purple-500/30 text-left space-y-3 shadow-lg">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎭</span>
              <span>Rolların Müzakirə Taktikası:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="p-3 rounded-xl bg-game-dark/70 border border-purple-500/20 space-y-1">
                <span className="font-bold text-cyan-300 flex items-center gap-1">🛡️ Dinc Sakin</span>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Digər oyunçuların ipuclarını analiz edin. Kimin sözü kontekstdən bir qədər kənardırsa, onu sorğuya çəkin.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-game-dark/70 border border-purple-500/20 space-y-1">
                <span className="font-bold text-red-400 flex items-center gap-1">🕵️‍♂️ İmposter (Casus)</span>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Əvvəlki oyunçuların ipuclarından onların əsas sözünü təxmin edin və ona uyğun, şübhə doğurmayan söz deyin.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SÖZLƏRİN VƏ İMPOSTERLƏRİN İFŞA EKRANI */
        <div className="rounded-3xl bg-gradient-to-b from-[#1c1328] to-[#120e1f] border-2 border-purple-500 p-6 space-y-6 shadow-2xl animate-fadeIn text-left">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Oyun Nəticəsi</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              Sözlər və İmposterlər
            </h3>
          </div>

          {/* Sözlərin müqayisəsi */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 text-center space-y-1">
              <span className="text-[11px] font-bold text-cyan-300 uppercase">
                Oyunçuların Sözü
              </span>
              <div className="text-xl font-extrabold text-cyan-200">
                {wordPair.civilian}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-center space-y-1">
              <span className="text-[11px] font-bold text-red-300 uppercase">
                İmposterin Sözü
              </span>
              <div className="text-xl font-extrabold text-red-400">
                {wordPair.imposter}
              </div>
            </div>
          </div>

          {/* Rolların siyahısı */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Bütün Oyunçuların Rolları:
            </span>
            <div className="space-y-2">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    p.isImposter
                      ? 'bg-red-950/40 border-red-500 text-red-200'
                      : 'bg-game-dark border-game-border text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.avatarEmoji}
                    </div>
                    <span className="font-bold text-sm text-white">
                      {p.name}
                    </span>
                  </div>

                  {p.isImposter ? (
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-red-600/40">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      İmposter
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
                      Dinc Sakin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Yenidən Oyna Düymələri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                sounds.playClick();
                onPlayAgain();
              }}
              className="py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Eyni Heyətlə Təkrar Oyna</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onNewGameSetup();
              }}
              className="py-3.5 rounded-xl bg-game-dark hover:bg-game-card border border-game-border text-gray-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Yeni Oyun / Lobi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
