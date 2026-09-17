'use client';

import React, { useState } from 'react';
import { UserPlus, Trash2, ArrowLeft, Play, Skull, Plus, Minus, Shield, Check, Sparkles } from 'lucide-react';
import { MafiaPlayer } from '@/types';
import { MAFIA_ROLES } from '@/data/mafiaRoles';
import { AVATAR_COLORS, AVATAR_EMOJIS } from '@/data/words';
import { sounds, triggerHaptic } from '@/utils/audio';

interface MafiaSetupProps {
  onStartGame: (players: MafiaPlayer[]) => void;
  onBackToLobby: () => void;
}

export default function MafiaSetup({ onStartGame, onBackToLobby }: MafiaSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Rəşad', 'Aysel', 'Tural', 'Nigar', 'Elvin', 'Leyla'
  ]);
  const [newInputName, setNewInputName] = useState('');
  const [mafiaCount, setMafiaCount] = useState(1);
  const [includeDon, setIncludeDon] = useState(true);
  const [includeSheriff, setIncludeSheriff] = useState(true);
  const [includeDoctor, setIncludeDoctor] = useState(true);
  const [includeManiac, setIncludeManiac] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Xüsusi rolların cəmi
  const totalSpecialRoles =
    mafiaCount +
    (includeDon ? 1 : 0) +
    (includeSheriff ? 1 : 0) +
    (includeDoctor ? 1 : 0) +
    (includeManiac ? 1 : 0);

  const civilianCount = Math.max(0, playerNames.length - totalSpecialRoles);

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newInputName.trim();
    if (!trimmed) return;
    if (playerNames.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage('Bu adda oyunçu artıq siyahıda var!');
      return;
    }
    if (playerNames.length >= 20) {
      setErrorMessage('Maksimum 20 oyunçu əlavə edilə bilər.');
      return;
    }

    sounds.playClick();
    triggerHaptic(20);
    setPlayerNames([...playerNames, trimmed]);
    setNewInputName('');
    setErrorMessage('');
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length <= 4) {
      setErrorMessage('Mafiya üçün ən azı 4 oyunçu tövsiyə olunur!');
      return;
    }
    sounds.playClick();
    triggerHaptic(20);
    const updated = playerNames.filter((_, i) => i !== index);
    setPlayerNames(updated);
    setErrorMessage('');
  };

  const handleQuickAdd = () => {
    const samples = ['Murad', 'Kənan', 'Fidan', 'Sevinc', 'Orxan', 'Cavid', 'Səbinə'];
    const available = samples.filter((s) => !playerNames.includes(s));
    if (available.length > 0) {
      sounds.playClick();
      triggerHaptic(20);
      setPlayerNames([...playerNames, available[0]]);
      setErrorMessage('');
    }
  };

  const handleStart = () => {
    if (playerNames.length < 4) {
      setErrorMessage('Mafiya oyununu başlatmaq üçün ən azı 4 oyunçu lazımdır!');
      return;
    }

    if (totalSpecialRoles >= playerNames.length) {
      setErrorMessage('Xüsusi rolların sayı ümumi oyunçu sayından az olmalıdır!');
      return;
    }

    sounds.playFanfare();
    triggerHaptic([50, 70, 50]);

    // Rol kartları hovuzunu yarat
    const rolesPool: (typeof MAFIA_ROLES)[keyof typeof MAFIA_ROLES][] = [];

    if (includeDon) rolesPool.push(MAFIA_ROLES.don);
    for (let i = 0; i < mafiaCount; i++) {
      rolesPool.push(MAFIA_ROLES.mafia);
    }
    if (includeSheriff) rolesPool.push(MAFIA_ROLES.sheriff);
    if (includeDoctor) rolesPool.push(MAFIA_ROLES.doctor);
    if (includeManiac) rolesPool.push(MAFIA_ROLES.maniac);

    // Qalan yerlərə Dinc Sakin əlavə et
    while (rolesPool.length < playerNames.length) {
      rolesPool.push(MAFIA_ROLES.civilian);
    }

    // Shuffle rolları
    for (let i = rolesPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rolesPool[i], rolesPool[j]] = [rolesPool[j], rolesPool[i]];
    }

    // Əvvəlcə bütün oyunçuları rollarla təyin et
    const tempPlayers = playerNames.map((name, idx) => ({
      id: `mp-${idx}-${Date.now()}`,
      name,
      avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      avatarEmoji: AVATAR_EMOJIS[idx % AVATAR_EMOJIS.length],
      role: rolesPool[idx],
    }));

    // Mafiyalar bir-birini bilsin deyə müttəfiqlərin adlarını yığ
    const mafiaTeamNames = tempPlayers
      .filter((p) => p.role.id === 'mafia' || p.role.id === 'don')
      .map((p) => p.name);

    const finalPlayers: MafiaPlayer[] = tempPlayers.map((p) => {
      const isBlack = p.role.id === 'mafia' || p.role.id === 'don';
      return {
        ...p,
        allies: isBlack ? mafiaTeamNames.filter((n) => n !== p.name) : undefined,
      };
    });

    onStartGame(finalPlayers);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fadeIn pb-24 md:pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onBackToLobby();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-game-card border border-game-border hover:border-red-500/50 text-gray-300 hover:text-white transition-all text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lobi</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center">
            <Skull className="w-4 h-4 text-red-400" />
          </div>
          <h2 className="text-base md:text-lg font-extrabold text-white">
            Klassik Mafia Quraşdırması
          </h2>
        </div>
      </div>

      {/* Xəta Mesajı */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center justify-between animate-shake">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-xs text-red-400 font-bold ml-2">✕</button>
        </div>
      )}

      {/* 1. Oyunçu Siyahısı */}
      <div className="rounded-3xl bg-game-card border border-game-border p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-red-400" />
            <span>Oyunçular ({playerNames.length})</span>
          </label>
          <button
            onClick={handleQuickAdd}
            className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20"
          >
            <Plus className="w-3 h-3" />
            + Tez Əlavə Et
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAddPlayer} className="flex gap-2">
          <input
            type="text"
            value={newInputName}
            onChange={(e) => setNewInputName(e.target.value)}
            placeholder="Oyunçunun adı..."
            maxLength={18}
            className="flex-1 bg-game-dark border border-game-border focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Əlavə et</span>
          </button>
        </form>

        {/* Oyunçu Çipləri */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          {playerNames.map((name, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-game-dark/80 border border-game-border"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 text-white shadow-sm"
                  style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                >
                  {AVATAR_EMOJIS[idx % AVATAR_EMOJIS.length]}
                </div>
                <span className="text-xs font-semibold text-gray-200 truncate">
                  {name}
                </span>
              </div>
              <button
                onClick={() => handleRemovePlayer(idx)}
                className="text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                title="Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Rolların Tənzimlənməsi */}
      <div className="rounded-3xl bg-game-card border border-game-border p-5 md:p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          <span>Rollar və Heyət Balansı</span>
        </h3>

        {/* Mafiya Sayı Stepper */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-game-dark/80 border border-game-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕵️‍♂️</span>
            <div>
              <div className="text-xs font-bold text-white">Sıravi Mafiya Sayı</div>
              <div className="text-[11px] text-gray-400">Qara qüvvənin əsas üzvləri</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-game-card border border-game-border rounded-xl p-1">
            <button
              onClick={() => {
                if (mafiaCount > 0) {
                  sounds.playClick();
                  setMafiaCount(mafiaCount - 1);
                }
              }}
              disabled={mafiaCount <= 0}
              className="w-7 h-7 rounded-lg bg-game-dark hover:bg-white/10 disabled:opacity-30 flex items-center justify-center text-white"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-black text-red-400">
              {mafiaCount}
            </span>
            <button
              onClick={() => {
                if (mafiaCount < 5) {
                  sounds.playClick();
                  setMafiaCount(mafiaCount + 1);
                }
              }}
              disabled={mafiaCount >= 5}
              className="w-7 h-7 rounded-lg bg-game-dark hover:bg-white/10 disabled:opacity-30 flex items-center justify-center text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Xüsusi Rol Toggle Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Don */}
          <div
            onClick={() => {
              sounds.playClick();
              setIncludeDon(!includeDon);
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              includeDon
                ? 'bg-red-950/30 border-red-500/60 shadow-md shadow-red-950/30'
                : 'bg-game-dark/60 border-game-border opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👑</span>
              <div>
                <div className="text-xs font-bold text-white">Don (Lider)</div>
                <div className="text-[10px] text-gray-400">Mafiyanın başçısı</div>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${includeDon ? 'bg-red-600 border-red-400 text-white' : 'border-gray-600'}`}>
              {includeDon && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Komissar */}
          <div
            onClick={() => {
              sounds.playClick();
              setIncludeSheriff(!includeSheriff);
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              includeSheriff
                ? 'bg-cyan-950/30 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                : 'bg-game-dark/60 border-game-border opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⭐</span>
              <div>
                <div className="text-xs font-bold text-white">Komissar (Şerif)</div>
                <div className="text-[10px] text-gray-400">Gecələr rol yoxlayır</div>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${includeSheriff ? 'bg-cyan-600 border-cyan-400 text-white' : 'border-gray-600'}`}>
              {includeSheriff && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Həkim */}
          <div
            onClick={() => {
              sounds.playClick();
              setIncludeDoctor(!includeDoctor);
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              includeDoctor
                ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md'
                : 'bg-game-dark/60 border-game-border opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💉</span>
              <div>
                <div className="text-xs font-bold text-white">Həkim (Doktor)</div>
                <div className="text-[10px] text-gray-400">Gecələr sağaldır</div>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${includeDoctor ? 'bg-emerald-600 border-emerald-400 text-white' : 'border-gray-600'}`}>
              {includeDoctor && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Manyaq */}
          <div
            onClick={() => {
              sounds.playClick();
              setIncludeManiac(!includeManiac);
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              includeManiac
                ? 'bg-amber-950/30 border-amber-500/60 shadow-md'
                : 'bg-game-dark/60 border-game-border opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔪</span>
              <div>
                <div className="text-xs font-bold text-white">Manyaq</div>
                <div className="text-[10px] text-gray-400">Neytral qatil</div>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${includeManiac ? 'bg-amber-600 border-amber-400 text-white' : 'border-gray-600'}`}>
              {includeManiac && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Dinc Sakin Statusu */}
        <div className="p-3 rounded-2xl bg-game-dark border border-game-border/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <span>🛡️</span>
            <span>Dinc Sakinlər (Avtomatik):</span>
          </div>
          <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {civilianCount} Nəfər
          </span>
        </div>
      </div>

      {/* Başlat Düyməsi */}
      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-lg shadow-2xl shadow-red-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 animate-pulse-slow"
      >
        <Play className="w-6 h-6 fill-current" />
        <span>KARTLARA BAXMAĞA BAŞLA</span>
        <Sparkles className="w-5 h-5 text-amber-300" />
      </button>

      {/* Mafia Qaydaları və Rolların İzahı */}
      <div className="rounded-3xl bg-game-card/60 border border-game-border p-5 md:p-6 space-y-4 text-left">
        <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-2">
          <Skull className="w-4 h-4 text-red-400" />
          <span>Oyundakı Rollar Nə İşə Yarayır?</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
          <div className="p-3 rounded-2xl bg-game-dark/70 border border-red-500/20 space-y-1">
            <span className="font-bold text-red-400 flex items-center gap-1.5 text-sm">
              <span>👑</span> Don (Mafiya Başçısı)
            </span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Mafiyanın lideri. Gecələr mafiyalarla birgə qurban seçir və aparıcıdan Komissarın kimliyini yoxlamaq hüququna malikdir.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-game-dark/70 border border-red-500/20 space-y-1">
            <span className="font-bold text-red-400 flex items-center gap-1.5 text-sm">
              <span>🕵️‍♂️</span> Sıravi Mafiya
            </span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Qara komanda. Gecələr oyanaraq dinc sakinlərə hücum edir, gündüzlər isə özünü dinc sakin kimi göstərir.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-game-dark/70 border border-cyan-500/20 space-y-1">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5 text-sm">
              <span>⭐</span> Komissar (Şerif)
            </span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Qanun keşikçisi. Gecələr şübhələndiyi 1 nəfəri yoxlayır. Gündüz sakinlərə ipucları verərək mafiyanı tapmağa kömək edir.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-game-dark/70 border border-emerald-500/20 space-y-1">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
              <span>💉</span> Həkim (Doktor)
            </span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Həyat qurtaran. Gecələr hücuma məruz qalan 1 nəfəri (özü və ya digər oyunçu) sağaldaraq ölümdən xilas edir.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-game-dark/70 border border-amber-500/20 space-y-1">
            <span className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
              <span>🔪</span> Manyaq (Tək Qatil)
            </span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Neytral qüvvə. Həm sakinlərə, həm də mafiyaya qarşıdır. Məqsədi təkbaşına hər kəsi aradan qaldırmaqdır.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-game-dark/70 border border-gray-700/50 space-y-1">
            <span className="font-bold text-gray-200 flex items-center gap-1.5 text-sm">
              <span>🛡️</span> Dinc Sakinlər
            </span>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Şəhərin əsas əhalisi. Gecə yatır, gündüz diqqət və məntiqlə müzakirə edib səsvermə ilə mafiyaları şəhərdən qovur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
