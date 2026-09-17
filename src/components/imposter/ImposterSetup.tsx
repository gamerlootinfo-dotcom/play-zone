'use client';

import React, { useState } from 'react';
import { UserPlus, Trash2, ArrowLeft, Play, ShieldAlert, Sparkles, Plus, Minus, Tag } from 'lucide-react';
import { Player, Category } from '@/types';
import { CATEGORIES, AVATAR_COLORS, AVATAR_EMOJIS, WORD_PAIRS } from '@/data/words';
import { sounds, triggerHaptic } from '@/utils/audio';

interface ImposterSetupProps {
  onStartGame: (players: Player[], categoryId: string, wordPair: { civilian: string; imposter: string; category: string; icon: string }) => void;
  onBackToLobby: () => void;
}

export default function ImposterSetup({ onStartGame, onBackToLobby }: ImposterSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Murad', 'Nigar', 'Elvin', 'Aysel'
  ]);
  const [newInputName, setNewInputName] = useState('');
  const [imposterCount, setImposterCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  // Maksimum mümkün imposter sayı
  const maxImposters = Math.max(1, Math.floor((playerNames.length - 1) / 2));

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newInputName.trim();
    if (!trimmed) return;
    if (playerNames.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage('Bu adda oyunçu artıq əlavə edilib!');
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
    if (playerNames.length <= 3) {
      setErrorMessage('Minimum 3 oyunçu olmalıdır!');
      return;
    }
    sounds.playClick();
    triggerHaptic(20);
    const updated = playerNames.filter((_, i) => i !== index);
    setPlayerNames(updated);
    if (imposterCount > Math.floor((updated.length - 1) / 2)) {
      setImposterCount(Math.max(1, Math.floor((updated.length - 1) / 2)));
    }
    setErrorMessage('');
  };

  const handleQuickAdd = () => {
    const samples = ['Rəşad', 'Ləman', 'Kənan', 'Fidan', 'Tural', 'Leyla', 'Cavid', 'Sevinc'];
    const available = samples.filter(s => !playerNames.includes(s));
    if (available.length > 0) {
      sounds.playClick();
      triggerHaptic(20);
      setPlayerNames([...playerNames, available[0]]);
      setErrorMessage('');
    }
  };

  const handleStart = () => {
    if (playerNames.length < 3) {
      setErrorMessage('Oyuna başlamaq üçün ən azı 3 oyunçu lazımdır!');
      return;
    }

    if (imposterCount >= playerNames.length) {
      setErrorMessage('İmposter sayı ümumi oyunçu sayından az olmalıdır!');
      return;
    }

    sounds.playFanfare();
    triggerHaptic([40, 60, 40]);

    // 1. Təsadüfi Söz cütlüyü seçimi (Hər dəfə 100% random)
    const availablePairs = selectedCategory === 'all'
      ? WORD_PAIRS
      : WORD_PAIRS.filter(p => p.catId === selectedCategory);

    const randomIndex = Math.floor(Math.random() * availablePairs.length);
    const chosen = availablePairs[randomIndex] || WORD_PAIRS[0];

    // 50% ehtimalla dinc və imposter sözünü dəyişdir ki, heç vaxt təkrarlanma hissi olmasın
    const shouldSwap = Math.random() > 0.5;
    const randomPair = {
      civilian: shouldSwap ? chosen.imposter : chosen.civilian,
      imposter: shouldSwap ? chosen.civilian : chosen.imposter,
      category: chosen.category,
      icon: chosen.icon,
    };

    // 2. İmposterlərin random indekslərini seç
    const indices = Array.from({ length: playerNames.length }, (_, i) => i);
    // Fisher-Yates Shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const imposterIndices = new Set(indices.slice(0, imposterCount));

    // 3. Oyunçu obyektlərini yarat
    const finalPlayers: Player[] = playerNames.map((name, index) => {
      const isImposter = imposterIndices.has(index);
      return {
        id: `p-${index}-${Date.now()}`,
        name,
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
        avatarEmoji: AVATAR_EMOJIS[index % AVATAR_EMOJIS.length],
        isImposter,
        word: isImposter ? randomPair.imposter : randomPair.civilian,
        isEliminated: false,
      };
    });

    onStartGame(finalPlayers, selectedCategory, randomPair);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fadeIn pb-24 md:pb-12">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onBackToLobby();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-game-card border border-game-border hover:border-purple-500/50 text-gray-300 hover:text-white transition-all text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lobi</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <h2 className="text-base md:text-lg font-extrabold text-white">
            İmposter Quraşdırması
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

      {/* 1. Oyunçu Əlavə Etmə Paneli */}
      <div className="rounded-3xl bg-game-card border border-game-border p-5 md:p-6 space-y-4 shadow-xl shadow-purple-950/20">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-purple-400" />
            <span>Oyunçular ({playerNames.length})</span>
          </label>
          <button
            onClick={handleQuickAdd}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20"
          >
            <Plus className="w-3 h-3" />
            + Tez Oyunçu Əlavə Et
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddPlayer} className="flex gap-2">
          <input
            type="text"
            value={newInputName}
            onChange={(e) => setNewInputName(e.target.value)}
            placeholder="Oyunçunun adını yazın..."
            maxLength={18}
            className="flex-1 bg-game-dark border border-game-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all shadow-inner"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-sm shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Əlavə et</span>
          </button>
        </form>

        {/* Oyunçu Çipləri (Chips) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          {playerNames.map((name, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-game-dark/80 border border-game-border hover:border-game-border/80 transition-all group"
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
                className="text-gray-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                title="Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. İmposter Sayı & Qaydası */}
      <div className="rounded-3xl bg-game-card border border-game-border p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>İmposter (Casus) Sayı</span>
            </h3>
            <p className="text-xs text-gray-400">
              Oyunçuların arasından gizli casusların sayı
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-3 bg-game-dark border border-game-border rounded-2xl p-1">
            <button
              onClick={() => {
                if (imposterCount > 1) {
                  sounds.playClick();
                  triggerHaptic(20);
                  setImposterCount(imposterCount - 1);
                }
              }}
              disabled={imposterCount <= 1}
              className="w-9 h-9 rounded-xl bg-game-card hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-white transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-base font-extrabold text-red-400">
              {imposterCount}
            </span>
            <button
              onClick={() => {
                if (imposterCount < maxImposters) {
                  sounds.playClick();
                  triggerHaptic(20);
                  setImposterCount(imposterCount + 1);
                }
              }}
              disabled={imposterCount >= maxImposters}
              className="w-9 h-9 rounded-xl bg-game-card hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-white transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Kateqoriya Seçimi */}
      <div className="rounded-3xl bg-game-card border border-game-border p-5 md:p-6 space-y-3">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-cyan-400" />
          <span>Söz Kateqoriyası</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat: Category) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                triggerHaptic(20);
                setSelectedCategory(cat.id);
              }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400 text-white shadow-md shadow-purple-500/20'
                  : 'bg-game-dark/60 border border-game-border/60 text-gray-400 hover:text-gray-200 hover:border-game-border'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Başlat Düyməsi */}
      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-500 hover:via-pink-500 hover:to-red-400 text-white font-black text-lg shadow-2xl shadow-purple-600/40 hover:shadow-purple-600/60 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group animate-pulse-slow"
      >
        <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
        <span>KARTLARA BAXMAĞA BAŞLA</span>
        <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
      </button>

      {/* Oyun Qaydaları və Rolların İzahı */}
      <div className="rounded-3xl bg-game-card/60 border border-game-border p-5 space-y-4 text-left">
        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          <span>İmposter Oyununda Rollar Nə İşə Yarayır?</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
          <div className="p-3.5 rounded-2xl bg-game-dark/70 border border-cyan-500/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm">
              <span>🛡️</span>
              <span>Dinc Sakin Rolu</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Bütün dinc sakinlərə eyni söz verilir. Əsas vəzifəniz öz sözünüzü həddən artıq açıq demədən incə ipucları vermək, hamını dinləmək və sözü bilməyən və ya fərqli sözü olan casusu ifşa etməkdir.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-game-dark/70 border border-red-500/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>İmposter (Casus) Rolu</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              İmposterə dinc sakinlərin sözünə çox yaxın fərqli bir söz verilir. Əsas vəzifəniz digərlərinin ipuclarından onların əsas sözünü təxmin etmək, təbii danışaraq şübhələri yayındırmaq və ifşa olunmamaqdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
