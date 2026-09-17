'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Eye, Moon, Sun, RotateCcw, Users, ShieldAlert, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { MafiaPlayer } from '@/types';
import { sounds, triggerHaptic } from '@/utils/audio';

interface MafiaArenaProps {
  players: MafiaPlayer[];
  onPlayAgain: () => void;
  onNewGameSetup: () => void;
}

const NIGHT_PHASES = [
  {
    title: '🌃 Gecə Oldu, Şəhər Yatır',
    desc: 'Bütün oyunçular gözlərini yumur və başlarını aşağı salır. Şəhər tamamilə sakitləşir.',
    roleAlert: 'Hamı yatır 😴',
  },
  {
    title: '🕵️‍♂️ Mafiya və Don Oyanır',
    desc: 'Mafiyalar və Don səssizcə gözlərini açır, bir-birlərini tanıyır və işarə ilə bir qurban seçirlər.',
    roleAlert: 'Mafiya qurban seçir 🎯',
  },
  {
    title: '⭐ Komissar (Şerif) Oyanır',
    desc: 'Komissar gözlərini açır və aparıcıya şübhələndiyi 1 nəfəri göstərir. Aparıcı başı ilə bəli/xeyr işarəsi verir.',
    roleAlert: 'Komissar yoxlayır 🔍',
  },
  {
    title: '💉 Həkim Oyanır',
    desc: 'Həkim gözlərini açır və xilas etmək istədiyi 1 nəfəri aparıcıya göstərir.',
    roleAlert: 'Həkim sağaldır 🩺',
  },
  {
    title: '🌅 Səhər Açıldı, Şəhər Oyanır!',
    desc: 'Bütün şəhər sakinləri oyanır. Aparıcı gecənin nəticələrini elan edir və müzakirə başlayır!',
    roleAlert: 'Müzakirə və Səsvermə vaxtı 🗣️',
  },
];

export default function MafiaArena({
  players,
  onPlayAgain,
  onNewGameSetup,
}: MafiaArenaProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isTruthRevealed, setIsTruthRevealed] = useState(false);

  const handleNextPhase = () => {
    sounds.playClick();
    triggerHaptic(20);
    setCurrentPhaseIndex((prev) => (prev + 1) % NIGHT_PHASES.length);
  };

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

  const phase = NIGHT_PHASES[currentPhaseIndex];

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 md:py-8 space-y-6 animate-fadeIn pb-24 md:pb-12 text-center">
      {/* 1. Gecə / Gündüz Aparıcı Bələdçisi */}
      {!isTruthRevealed && (
        <div className="rounded-3xl bg-gradient-to-b from-game-card to-[#1d1421] border-2 border-red-500/40 p-6 md:p-8 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
              <Moon className="w-3.5 h-3.5" />
              <span>Aparıcı Bələdçisi ({currentPhaseIndex + 1}/{NIGHT_PHASES.length})</span>
            </span>

            <span className="text-xs font-bold text-gray-400">
              {players.length} Oyunçu
            </span>
          </div>

          <div className="space-y-2 py-2">
            <h3 className="text-xl md:text-2xl font-black text-white">
              {phase.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-sm mx-auto">
              {phase.desc}
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1.5 rounded-xl bg-game-dark border border-game-border text-xs font-bold text-red-300">
                {phase.roleAlert}
              </span>
            </div>
          </div>

          {/* Növbəti mərhələ düyməsi */}
          <button
            onClick={handleNextPhase}
            className="w-full py-3 rounded-xl bg-game-dark hover:bg-game-border/80 border border-game-border text-gray-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Növbəti Addım</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. ROLLARI AÇ DÜYMƏSİ VƏ YA NƏTİCƏLƏR */}
      {!isTruthRevealed ? (
        <div className="space-y-4">
          <button
            onClick={handleRevealTruth}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base md:text-lg shadow-2xl shadow-red-600/40 hover:shadow-red-600/60 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group animate-pulse-slow"
          >
            <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>ROLLARI VƏ NƏTİCƏNİ AÇ</span>
          </button>

          {/* Arenada Rolların Bələdçisi */}
          <div className="p-5 rounded-2xl bg-game-card/70 border border-game-border text-left space-y-3 shadow-lg">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎭</span>
              <span>Oyundakı Rolların Vəzifələri:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
              <div className="p-2.5 rounded-xl bg-game-dark/70 border border-game-border/60 space-y-1">
                <span className="font-bold text-red-400 flex items-center gap-1">👑 Don (Lider)</span>
                <p className="text-[11px] text-gray-400">Gecə qurbanı təsdiqləyir və Komissarı tapmağa çalışır.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-game-dark/70 border border-game-border/60 space-y-1">
                <span className="font-bold text-red-400 flex items-center gap-1">🕵️‍♂️ Mafiya</span>
                <p className="text-[11px] text-gray-400">Gecə dinc sakinləri vurur, gündüz özünü gizlədir.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-game-dark/70 border border-game-border/60 space-y-1">
                <span className="font-bold text-cyan-400 flex items-center gap-1">⭐ Komissar</span>
                <p className="text-[11px] text-gray-400">Gecələr 1 nəfərin kimliyini yoxlayır, dinc sakinləri yönləndirir.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-game-dark/70 border border-game-border/60 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1">💉 Həkim</span>
                <p className="text-[11px] text-gray-400">Gecələr hücuma məruz qalan 1 nəfəri sağaldır.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Rolların Tam İfşası */
        <div className="rounded-3xl bg-gradient-to-b from-[#1c1328] to-[#120e1f] border-2 border-red-500/80 p-6 space-y-6 shadow-2xl animate-fadeIn text-left">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bütün Rollar İfşa Olundu</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              Mafiya və Şəhər Sakinləri
            </h3>
          </div>

          {/* Rollar siyahısı */}
          <div className="space-y-2.5">
            {players.map((p) => (
              <div
                key={p.id}
                className={`p-3.5 rounded-2xl border flex flex-col gap-2 ${
                  p.role.team === 'black'
                    ? 'bg-red-950/40 border-red-500/80'
                    : p.role.team === 'neutral'
                    ? 'bg-amber-950/40 border-amber-500/80'
                    : 'bg-game-dark border-game-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base shadow"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.avatarEmoji}
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-white block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {p.role.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.role.icon}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.role.team === 'black'
                          ? 'bg-red-600 text-white'
                          : p.role.team === 'neutral'
                          ? 'bg-amber-600 text-white'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {p.role.name}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-300 pl-1">
                  💡 {p.role.description}
                </p>
              </div>
            ))}
          </div>

          {/* Düymələr */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                sounds.playClick();
                onPlayAgain();
              }}
              className="py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
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
